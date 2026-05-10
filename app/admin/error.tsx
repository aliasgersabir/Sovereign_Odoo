"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <div className="error-icon">📊</div>
      <h2 className="error-title">Dashboard Error</h2>
      <p className="error-desc">
        The admin dashboard encountered an error. Please try reloading the page.
      </p>
      <button className="error-btn" onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}
