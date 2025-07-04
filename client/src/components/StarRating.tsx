import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({ 
  rating, 
  readonly = false, 
  size = "md", 
  onRatingChange 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleStarClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            sizeClasses[size],
            "star-rating",
            value <= rating ? "fill-current" : "text-muted-foreground",
            !readonly && "cursor-pointer hover:text-accent"
          )}
          onClick={() => handleStarClick(value)}
        />
      ))}
    </div>
  );
}
