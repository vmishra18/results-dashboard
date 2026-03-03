import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { QuestionAnswer } from "../types/assessment";
import { normalizeLikertToPercent } from "../utils/assessmentTransforms";
import "./ScoreByQuestionBarChart.css";

type Props = {
  questions: QuestionAnswer[];
};

type ChartRow = {
  key: string;
  label: string;
  percent: number;
};

export default function ScoreByQuestionBarChart({ questions }: Props) {
  const data = useMemo<ChartRow[]>(() => {
    return questions
      .filter((q) => !q.is_reflection)
      .filter((q) => q.is_answered && typeof q.answer_value === "number")
      .map((q) => ({
        key: q.question_id,
        label: `Q${q.question_sequence}`,
        percent: normalizeLikertToPercent(
          q.answer_value as number,
          q.max_score || 5,
        ),
      }));
  }, [questions]);

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        No scored answers yet (answer some Likert questions to see the chart).
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Score by Question</h3>
        <p>Likert answers normalized to 0–100%</p>
      </div>

      <div className="chart-wrap" aria-label="Bar chart of score by question">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
            <Bar dataKey="percent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
