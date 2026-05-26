// components/sections/DashboardServer.tsx
import { fetchGitHubData } from '@/lib/github'
import { Dashboard } from './Dashboard'

export async function DashboardServer() {
  const githubData = await fetchGitHubData()
  return <Dashboard githubData={githubData} />
}