"use client";

export default function ItineraryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <div className="error-icon">📅</div>
      <h2 className="error-title">Itinerary Error</h2>
      <p className="error-desc">
        We couldn&apos;t load your trip itinerary. Your data is safe — please try again.
      </p>
      <button className="error-btn" onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}
