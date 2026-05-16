import type { AssessmentResultsResponse, QuestionAnswer } from '../types/assessment'

export function flattenQuestions(results: AssessmentResultsResponse): QuestionAnswer[] {
  const all: QuestionAnswer[] = []

  for (const elementScore of Object.values(results.element_scores)) {
    all.push(...elementScore.question_answers)
  }

  return all.sort((a, b) => a.question_sequence - b.question_sequence)
}

export function normalizeLikertToPercent(value: number, maxScore: number): number {
  // Backend uses Likert 1..5. If maxScore is 5, convert 1->0%, 5->100%.
  // I keep it generic: (value - 1) / (maxScore - 1)
  if (maxScore <= 1) return 0
  const clamped = Math.min(Math.max(value, 1), maxScore)
  return Math.round(((clamped - 1) / (maxScore - 1)) * 100)
}
