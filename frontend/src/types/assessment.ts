export type Insight = {
  type: string
  message: string
  positive: boolean
}

export type QuestionAnswer = {
  question_id: string
  question_title: string
  question_suite: string | null
  question_sequence: number
  is_reflection: boolean
  reflection_prompt: string | null
  element: string | null
  max_score: number
  is_answered: boolean
  answer_id?: string | null
  answer_value?: number | null
  answer_text?: string | null
  answer_option_id?: string | null
  answer_explanation?: string | null
  option_number?: number | null
  text_answer?: string | null
  numeric_value?: number | null
}

export type ElementScore = {
  element: string
  total_questions: number
  answered_questions: number
  completion_percentage: number
  scores: {
    total_score: number
    max_score: number
    percentage: number
  }
  question_answers: QuestionAnswer[]
}

export type AssessmentResultsResponse = {
  instance: {
    id: string
    created_at?: string | null
    updated_at?: string | null
    completed: boolean
    completed_at: string | null
    responder_name?: string | null
    element: string | null
  }
  total_questions: number
  answered_questions: number
  completion_percentage: number
  scores: {
    total_score: number
    max_score: number
    percentage: number
    element?: string | null
  }
  element_scores: Record<string, ElementScore>
  insights: Insight[]
}