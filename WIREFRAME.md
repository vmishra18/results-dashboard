# Dashboard Wireframe (Frontend Task)

## Overview

Enhance the existing results page with clearer structure, visual feedback, and light UX improvements.
Focus: clarity, simplicity, and realistic implementation within 2–3 hours.

## Layout

---

### Header: Assessment Results (Element X) + Instance ID

Row 1:
[ Progress Card ] [ Overall Score Card ] [ Chart Card ]

---

Row 2:
[ Filter | Sort | Export ]
[ Question List (4 items) ]

- sequence + title
- status badge (Answered / Unanswered / Reflection)
- score chip (if answered)
- click row → modal with full details

---

Row 3: Element Scores

---

Row 4: Insights

---

## Component Structure

- AssessmentResults (data fetch + loading/error states)
  - ProgressCard
  - ScoreCard
  - ScoreByQuestionBarChart
  - QuestionBreakdown
    - QuestionRow
    - QuestionDetailModal
  - ElementScores
  - Insights

## Data Handling

- Flatten element_scores[].question_answers
- Sort by sequence
- Normalise Likert (1–5 → 0–100%)
- Exclude reflection/unanswered from chart
- Use useMemo for derived data

## Visualisation

Bar Chart – Score by Question

- X-axis: Q1, Q2, Q3
- Y-axis: 0–100%
- Shows answered Likert questions only

Chosen for clarity & simplicity

## UX Enhancements

- Detailed Question Modal
- Filtering (All / Answered / Unanswered / Reflection)
- Sorting (Default / Highest score)
- Loading & error states

## Expected Outcome

- Clear performance overview
- Visual comparison across questions
- Structured question-level breakdown
- Responsive and maintainable design
