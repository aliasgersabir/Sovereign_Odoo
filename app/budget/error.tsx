"use client";

export default function BudgetError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <div className="error-icon">💰</div>
      <h2 className="error-title">Budget Error</h2>
      <p className="error-desc">
        Something went wrong loading your budget data. Your expenses are safe — please try again.
      </p>
      <button className="error-btn" onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}
