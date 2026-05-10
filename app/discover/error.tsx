"use client";

export default function DiscoverError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <div className="error-icon">🌍</div>
      <h2 className="error-title">Discovery Error</h2>
      <p className="error-desc">
        We couldn&apos;t load destinations right now. Please check your connection and try again.
      </p>
      <button className="error-btn" onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}
