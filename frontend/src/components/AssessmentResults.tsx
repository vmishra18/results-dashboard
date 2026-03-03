import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./AssessmentResults.css";

import type { AssessmentResultsResponse } from "../types/assessment";
import { flattenQuestions } from "../utils/assessmentTransforms";
import ScoreByQuestionBarChart from "./ScoreByQuestionBarChart";
import QuestionBreakdown from "./QuestionBreakdown";

interface Props {
  instanceId: string;
}

export default function AssessmentResults({ instanceId }: Props) {
  const [results, setResults] = useState<AssessmentResultsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8002";

  const fetchResults = useCallback(async () => {
    if (!instanceId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/assessment/results/${instanceId}`,
      );
      setResults(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to load assessment results",
      );
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, instanceId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const questions = useMemo(
    () => (results ? flattenQuestions(results) : []),
    [results],
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-title">Loading results…</div>
        <div className="loading-subtitle">Fetching latest assessment data.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div className="error-title">Couldn’t load results</div>
        <div className="error-message">Error: {error}</div>
        <button className="error-retry" onClick={fetchResults}>
          Retry
        </button>
      </div>
    );
  }

  if (!results) {
    return <div className="empty">No results to display</div>;
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "#27ae60";
    if (percentage >= 60) return "#f39c12";
    return "#e74c3c";
  };

  return (
    <div className="assessment-results">
      <div className="results-header">
        <h2>Assessment Results - Element {results.instance.element ?? "-"}</h2>
        <p className="instance-id">Instance: {results.instance.id}</p>
      </div>

      <div className="dashboard-grid">
        {/* Progress Card */}
        <div className="card progress-card">
          <h3>Progress</h3>
          <div className="progress-circle">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#3498db"
                strokeWidth="12"
                strokeDasharray={`${(results.completion_percentage / 100) * 339.292} 339.292`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="progress-text">
              <span className="progress-percentage">
                {results.completion_percentage}%
              </span>
              <span className="progress-label">Complete</span>
            </div>
          </div>
          <div className="progress-details">
            <p>
              {results.answered_questions} of {results.total_questions}{" "}
              questions answered
            </p>
          </div>
        </div>

        {/* Score Card */}
        <div className="card score-card">
          <h3>Overall Score</h3>
          <div className="score-display">
            <div
              className="score-percentage"
              style={{ color: getScoreColor(results.scores.percentage) }}
            >
              {results.scores.percentage}%
            </div>
            <div className="score-details">
              <p>
                {results.scores.total_score} / {results.scores.max_score} points
              </p>
              <p className="score-note">Normalized from 1-5 scale</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-slot">
          <ScoreByQuestionBarChart questions={questions} />
        </div>
      </div>

      {/* Questions */}
      <div className="section-stack">
        <QuestionBreakdown questions={questions} />
      </div>

      {/* Element Scores (existing) */}
      {Object.keys(results.element_scores).length > 0 && (
        <div className="card element-scores-card">
          <h3>Scores by Element</h3>
          <div className="element-scores">
            {Object.values(results.element_scores).map((elementScore) => (
              <div key={elementScore.element} className="element-score">
                <div className="element-header">
                  <span className="element-name">
                    Element {elementScore.element}
                  </span>
                  <span
                    className="element-percentage"
                    style={{
                      color: getScoreColor(elementScore.scores.percentage),
                    }}
                  >
                    {elementScore.scores.percentage}%
                  </span>
                </div>
                <div className="element-progress-bar">
                  <div
                    className="element-progress-fill"
                    style={{
                      width: `${elementScore.completion_percentage}%`,
                      backgroundColor: getScoreColor(
                        elementScore.scores.percentage,
                      ),
                    }}
                  />
                </div>
                <div className="element-details">
                  <span>
                    {elementScore.answered_questions} /{" "}
                    {elementScore.total_questions} answered
                  </span>
                  <span>
                    {elementScore.scores.total_score} /{" "}
                    {elementScore.scores.max_score} points
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights (existing) */}
      {results.insights.length > 0 && (
        <div className="card insights-card">
          <h3>Insights</h3>
          <div className="insights">
            {results.insights.map((insight, index) => (
              <div
                key={index}
                className={`insight ${insight.positive ? "positive" : "negative"}`}
              >
                <span className="insight-type">{insight.type}</span>
                <p className="insight-message">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
