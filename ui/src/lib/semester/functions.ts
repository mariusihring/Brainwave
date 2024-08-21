import { Semester } from "@/__generated__/graphql"

export function calculateProgress(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = new Date().getTime()

  if (now < start) return 0
  if (now > end) return 100

  const total = end - start
  const elapsed = now - start
  return Math.round((elapsed / total) * 100)
}

export function getDifficultyColor(difficulty: Semester['difficulty']) {
  switch (difficulty) {
    case 'Easy': return 'bg-green-500'
    case 'Moderate': return 'bg-yellow-500'
    case 'Challenging': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}