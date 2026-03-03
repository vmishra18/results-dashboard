# Solution – Vishal Mishra

## Task Completed

Frontend task (dashboard redesign with visualisation and UX enhancements)

## Time Spent

Approximately 3 hours and 15 mins (excluding Docker setup time).

## Approach

I started by running the project locally and reviewing the existing **AssessmentResults** component to understand how data was structured and rendered.

The current UI displayed summary information but did not include any visual comparison or question-level breakdown. My goal was to improve clarity without restructuring the whole application.

I approached the task in phases:

1. Confirm API structure and inspect returned data.
2. Plan data transformations required for visualisation.
3. Implement the bar chart for score comparison.
4. Build the question breakdown list.
5. Add modal for detailed view.
6. Add filtering and sorting.
7. Improve loading and error states.
8. Final responsive polish and cleanup.

I tried to keep changes incremental and consistent with the existing architecture.

## Implementation Details

### Visualisations

I implemented a **bar chart using Recharts** to display score percentage per answered Likert question.

I chose a bar chart because:

- It clearly compares performance across questions.
- It works well for small datasets.
- It is quick to interpret visually.

Only answered Likert questions are included in the chart. Reflection and unanswered questions are excluded to avoid misleading visual data.

## Question Breakdown

I flattened **element_scores[].question_answers** into a single array and sorted questions by sequence.

Each row shows:

- Question sequence
- Title
- Status badge (Answered / Unanswered / Reflection)
- Score chip (for answered Likert questions)

Clicking a row opens a modal with:

- Full question text
- Selected answer
- Numeric value
- Reflection text

This keeps the main list clean while allowing detailed inspection.

## UX Enhancements Implemented

**1. Detailed Question Modal**

- Opens on row click.
- Shows full context without cluttering the main layout.
- Closes via button or outside click.

**2. Filtering & Sorting**

- Filter by: All / Answered / Unanswered / Reflection.
- Sort by: Default sequence / Highest score.
- Filtering is applied before sorting.

**3. Loading & Error Handling**

- Loading message during API fetch.
- Friendly error message with retry button.
- Tested with invalid instance ID.

**4. Export JSON**

- Allows downloading visible questions as JSON.
- Lightweight implementation using client-side data.

## Tools & Libraries Used

- **Recharts** – for bar chart visualisation.
- Existing project dependencies and styling approach.
- No UI frameworks were introduced to keep consistency.

### AI Tools Used

- ChatGPT – used for:
  - Quick reference on Recharts configuration.
  - TypeScript type refinement.
  - Minor refactoring suggestions.

All design decisions, structure, and explanations were written by me.

## Testing

- **docker-compose up -d**
- Verified API response using curl.
- Checked UI in browser (**http://localhost:3000**).
- Ran:
  - **npm run typecheck**
  - **npm run build**
- Tested error handling using an invalid instance ID.
- Checked layout responsiveness on smaller screen widths.

## Challenges & Solutions

**1. Structuring API data for chart usage**
The API groups questions under element scores. I flattened and memoised the data using **useMemo** to simplify chart and filtering logic.

**2. Handling mixed question types**
Likert and reflection questions required different rendering logic. I separated visualisation logic from display logic to avoid condition-heavy components.

**3. Maintaining clean component structure**
To avoid a large monolithic component, I separated chart, list, and modal into smaller components while keeping data flow simple.

## Trade-offs & Future Improvements

Given the time expectations for this project which was mentioned 2-3 hour , I focused on clarity and stability over feature richness.

If more time were available, I would:

- Add chart tooltips with richer context.
- Improve styling polish and spacing.
- Add unit tests for transformation logic.
- Implement keyboard navigation improvements.
- Add dark mode toggle.
