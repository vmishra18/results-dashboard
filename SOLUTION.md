# Solution – Vishal Mishra

**Task Completed**

Frontend task (dashboard redesign with visualisation and UX enhancements) 

**Time Spent**

Approximately 3 hours 15 minutes (Docker setup excluded). I kept scope tight and didn’t add extra features outside the brief.

## Approach

I started by running the project locally and going through the existing **AssessmentResults** component to understand how the API response was structured and how the data was being displayed.

The original UI showed overall progress and score clearly, but there wasn’t much visibility at the individual question level. My goal was to make it easier to analyse results without changing the app structure or overcomplicating it.

I worked through it step by step. First, I checked the API response using curl and looked closely at how **element_scores** and **question_answers** were structured. Once I understood the shape of the data, I planned how it would need to be transformed for both the chart and the filtering logic. I also kept the changes component-based (small focused components) so the main **AssessmentResults** container stayed readable, and I added a **typecheck** script (**tsc --noEmit**) because it wasn’t included by default.

I implemented the chart first to make sure the scoring data was behaving as expected. After that, I built the question list and added the modal for detailed viewing. Once the core functionality was working, I added filtering and sorting. Finally, I improved loading states, error handling, and basic responsiveness.

Throughout, I tried to stay consistent with the existing code style and structure. I avoided introducing new UI libraries or patterns that weren’t already part of the project.

## Visualisation

I used Recharts to build a simple bar chart showing the percentage score for each answered Likert question. Given the small dataset, a bar chart felt like the clearest and simplest way to compare performance across questions.

Only answered Likert questions are included in the chart. Reflection questions and unanswered questions are excluded so the chart doesn’t show incomplete or misleading data. Likert scores are converted to percentages so they match how scoring is represented elsewhere in the interface.

I used ResponsiveContainer to avoid layout issues on smaller screens and kept the chart height fixed to prevent jumping as data changes.

## Question Breakdown

Because the API groups questions under **element_scores**, I flattened the nested **question_answers** into a single ordered list before rendering. I wrapped that transformation in **useMemo** to avoid recalculating it on every render.

Each row displays the sequence number, title, element, and a status indicator. For answered Likert questions, a percentage chip is shown. Reflection and unanswered questions are clearly labelled.

Clicking a row opens a modal with the full question details. This includes the full question text, selected answer (if available), numeric score, and reflection text. I chose to use a modal instead of expandable rows to keep the main list clean and easier to scan.

## UX Improvements

Alongside the required breakdown and visualisation, I added a few small usability improvements.

Filtering allows switching between all questions, answered, unanswered, and reflection questions. Sorting can be toggled between default sequence order and highest score first. Filtering runs before sorting so the behaviour feels consistent.

I also added a simple client-side JSON export feature so the currently visible question data can be downloaded. This was implemented entirely on the frontend to keep things straightforward.

For network handling, I improved loading and error states. There’s a loading indicator while fetching, and a clear error message with a retry button if something goes wrong. I tested this using an invalid instance ID to make sure the state transitions worked properly.

I also adjusted the layout using CSS Grid and basic media queries to prevent horizontal overflow on smaller screens.

## Tools

Recharts was added for the chart. Other than that, I used the existing project setup and styling approach to keep everything consistent.

I used ChatGPT a couple times to sanity-check Recharts props and a TS type edge-case. The overall structure, implementation decisions, and this explanation are my own.

## Testing

I verified the API response using curl and confirmed the UI renders correctly at **http://localhost:3000.**

I ran:

- **npm run typecheck**
- **npm run build**

to make sure there were no type or production build issues.

I manually tested:

- A valid instance ID
- An invalid instance ID (error state)
- Different filtering and sorting combinations
- Modal open/close behaviour
- Smaller screen sizes

## Challenges

The main challenge was the nested API shape: **question_answers** live under each **element_scores** entry. I initially rendered per element, but it made filtering/sorting awkward and duplicated UI logic. Flattening once, sorting by **question_sequence**, and then deriving the chart/filter views from the same list kept the UI predictable and the code simpler.

Handling the mixed question types also needed care — reflection questions don’t have a numeric score, and unanswered Likert questions shouldn’t show a % chip or appear in the chart.

## Trade-offs & Future Improvements

Given the time constraint, I prioritised clarity and correctness over extra polish. With more time, I’d add a couple React Testing Library tests around the transform helpers, improve keyboard accessibility for the modal (focus trap + ESC to close), and add chart interactions (tooltips/drill-down).
