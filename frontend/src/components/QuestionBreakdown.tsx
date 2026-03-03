import { useMemo, useState } from "react";
import type { QuestionAnswer } from "../types/assessment";
import { normalizeLikertToPercent } from "../utils/assessmentTransforms";
import QuestionDetailModal from "./QuestionDetailModal";
import "./QuestionBreakdown.css";

type Filter = "all" | "answered" | "unanswered" | "reflection";
type Sort = "sequence" | "score_desc";

type Props = {
  questions: QuestionAnswer[];
};

export default function QuestionBreakdown({ questions }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("sequence");
  const [selected, setSelected] = useState<QuestionAnswer | null>(null);

  const view = useMemo(() => {
    let items = [...questions];

    if (filter === "answered") items = items.filter((q) => q.is_answered);
    if (filter === "unanswered") items = items.filter((q) => !q.is_answered);
    if (filter === "reflection") items = items.filter((q) => q.is_reflection);

    if (sort === "sequence") {
      items.sort((a, b) => a.question_sequence - b.question_sequence);
    }

    if (sort === "score_desc") {
      items.sort((a, b) => {
        const aScore =
          !a.is_reflection &&
          a.is_answered &&
          typeof a.answer_value === "number"
            ? normalizeLikertToPercent(a.answer_value, a.max_score || 5)
            : -1;
        const bScore =
          !b.is_reflection &&
          b.is_answered &&
          typeof b.answer_value === "number"
            ? normalizeLikertToPercent(b.answer_value, b.max_score || 5)
            : -1;
        return bScore - aScore;
      });
    }

    return items;
  }, [questions, filter, sort]);

  const exportJson = () => {
    const payload = {
      exported_at: new Date().toISOString(),
      total: questions.length,
      questions: view,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "assessment-questions-export.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const scoreChip = (q: QuestionAnswer) => {
    if (q.is_reflection)
      return <span className="chip chip-reflection">Reflection</span>;
    if (!q.is_answered)
      return <span className="chip chip-unanswered">Unanswered</span>;

    if (typeof q.answer_value === "number") {
      const pct = normalizeLikertToPercent(q.answer_value, q.max_score || 5);
      return <span className="chip chip-answered">{pct}%</span>;
    }

    return <span className="chip chip-answered">Answered</span>;
  };

  return (
    <div className="qb-card">
      <div className="qb-header">
        <h3>Questions</h3>

        <div className="qb-controls">
          <label>
            Filter
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
            >
              <option value="all">All</option>
              <option value="answered">Answered</option>
              <option value="unanswered">Unanswered</option>
              <option value="reflection">Reflection</option>
            </select>
          </label>

          <label>
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
            >
              <option value="sequence">By sequence</option>
              <option value="score_desc">By score (high → low)</option>
            </select>
          </label>

          <button className="qb-export" onClick={exportJson}>
            Export JSON
          </button>
        </div>
      </div>

      <div className="qb-list" role="list">
        {view.map((q) => (
          <button
            key={q.question_id}
            className="qb-row"
            onClick={() => setSelected(q)}
            role="listitem"
          >
            <div className="qb-left">
              <div className="qb-seq">Q{q.question_sequence}</div>
              <div className="qb-title">{q.question_title}</div>
              <div className="qb-meta">
                <span>Element {q.element ?? "-"}</span>
                {q.question_suite ? <span>• {q.question_suite}</span> : null}
              </div>
            </div>

            <div className="qb-right">{scoreChip(q)}</div>
          </button>
        ))}
      </div>

      {selected && (
        <QuestionDetailModal
          question={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
