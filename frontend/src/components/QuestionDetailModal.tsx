import type { QuestionAnswer } from "../types/assessment";
import "./QuestionDetailModal.css";

type Props = {
  question: QuestionAnswer;
  onClose: () => void;
};

export default function QuestionDetailModal({ question, onClose }: Props) {
  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Question details"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              Question {question.question_sequence}
            </h3>
            <p className="modal-subtitle">Element {question.element ?? "-"}</p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h4>Title</h4>
            <p>{question.question_title}</p>
          </div>

          {question.is_reflection && (
            <div className="modal-section">
              <h4>Reflection prompt</h4>
              <p>{question.reflection_prompt ?? "—"}</p>
            </div>
          )}

          <div className="modal-section">
            <h4>Answer</h4>

            {!question.is_answered && <p className="muted">Not answered</p>}

            {question.is_answered && question.is_reflection && (
              <p>{question.text_answer?.trim() ? question.text_answer : "—"}</p>
            )}

            {question.is_answered && !question.is_reflection && (
              <>
                <p>
                  <strong>{question.answer_text ?? "Selected option"}</strong>
                  {typeof question.answer_value === "number"
                    ? ` (value: ${question.answer_value})`
                    : ""}
                </p>
                {question.answer_explanation && (
                  <p className="muted">{question.answer_explanation}</p>
                )}
              </>
            )}
          </div>

          <div className="modal-section meta">
            <div>
              <span className="muted">Suite:</span>{" "}
              {question.question_suite ?? "—"}
            </div>
            <div>
              <span className="muted">Max score:</span>{" "}
              {question.max_score || 5}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
