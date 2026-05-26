import type { GitHubData } from '@/components/sections/Dashboard'

interface GHContributionDay {
  date: string
  contributionCount: number
}

interface GHWeek {
  contributionDays: GHContributionDay[]
}

interface GHRepository {
  stargazerCount: number
  languages: {
    edges: { size: number; node: { name: string; color: string } }[]
  }
}

interface GHViewer {
  repositories: { nodes: GHRepository[] }
  contributionsCollection: {
    totalCommitContributions: number
    contributionCalendar: {
      weeks: GHWeek[]
    }
  }
}

interface GHResponse {
  data: { viewer: GHViewer }
}

export async function fetchGitHubData(): Promise<GitHubData | null> {
  const token = process.env.GITHUB_TOKEN
  if (!token) return null

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          viewer {
            repositories(first: 100, ownerAffiliations: OWNER) {
              nodes {
                stargazerCount
                languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                  edges {
                    size
                    node { name color }
                  }
                }
              }
            }
            contributionsCollection {
              totalCommitContributions
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }`,
      }),
      next: { revalidate: 60 },
    })

    const { data }: GHResponse = await res.json()
    const viewer = data.viewer

    const allDays = viewer.contributionsCollection
      .contributionCalendar.weeks
      .flatMap((w) => w.contributionDays)
      .slice(-112)

    const sorted = [...allDays].reverse()
    let streak = 0
    for (const day of sorted) {
      if (day.contributionCount > 0) streak++
      else break
    }

    // Agrega bytes por linguagem em todos os repos
    const langTotals: Record<string, { bytes: number; color: string }> = {}
    for (const repo of viewer.repositories.nodes) {
      for (const edge of repo.languages.edges) {
        const name = edge.node.name
        if (!langTotals[name]) langTotals[name] = { bytes: 0, color: edge.node.color }
        langTotals[name].bytes += edge.size
      }
    }

    const totalBytes = Object.values(langTotals).reduce((acc, l) => acc + l.bytes, 0)

    const topLanguages = Object.entries(langTotals)
      .sort((a, b) => b[1].bytes - a[1].bytes)
      .slice(0, 5)
      .map(([name, { bytes, color }]) => ({
        name,
        color,
        pct: Math.round((bytes / totalBytes) * 100),
      }))

    return {
      totalStars: viewer.repositories.nodes.reduce((acc, r) => acc + r.stargazerCount, 0),
      totalRepos: viewer.repositories.nodes.length,
      totalCommitsThisYear: viewer.contributionsCollection.totalCommitContributions,
      streak,
      activityDays: allDays.map((d) => ({
        date: d.date,
        count: Math.min(d.contributionCount, 4),
      })),
      topLanguages,
    }
  } catch {
    return null
  }
}