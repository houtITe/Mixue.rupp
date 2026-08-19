import { Star } from "lucide-react";

export function RatingStars({
  rating = 5,
  reviews,
  size = 14,
}: {
  rating?: number;
  reviews?: number;
  size?: number;
}) {
  const full = Math.floor(rating);
  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < full ? "fill-current" : "opacity-30"}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-foreground/80">
        {rating.toFixed(1)}
      </span>
      {reviews !== undefined && (
        <span className="text-xs text-muted-foreground">({reviews})</span>
      )}
    </div>
  );
}