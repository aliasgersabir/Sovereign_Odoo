"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h2 className="error-title">Something went wrong</h2>
      <p className="error-desc">
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      <button className="error-btn" onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}
