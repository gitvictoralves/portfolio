import { NextResponse } from 'next/server'

export const revalidate = 60 // ISR — atualiza a cada 60s

const GITHUB_USERNAME = 'gitvictoralves'

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
        nodes {
          stargazerCount
          primaryLanguage { name }
        }
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      followers { totalCount }
    }
  }
`

export async function GET() {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USERNAME } }),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'GitHub API error' }, { status: 500 })
  }

  const { data } = await res.json()
  const user = data.user

  const totalStars = user.repositories.nodes.reduce(
    (acc: number, repo: { stargazerCount: number }) => acc + repo.stargazerCount,
    0
  )

  // Últimas 16 semanas de atividade
  const allWeeks = user.contributionsCollection.contributionCalendar.weeks
  const last16Weeks = allWeeks.slice(-16)
  const activityDays = last16Weeks.flatMap((w: { contributionDays: { date: string; contributionCount: number }[] }) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: Math.min(d.contributionCount, 4), // normaliza para 0-4 igual ao mock atual
    }))
  )

  return NextResponse.json({
    totalStars,
    totalRepos: user.repositories.totalCount,
    totalCommitsThisYear: user.contributionsCollection.totalCommitContributions,
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    followers: user.followers.totalCount,
    activityDays,
  })
}