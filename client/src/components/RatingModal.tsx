import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import StarRating from "./StarRating";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientId: string;
}

export default function RatingModal({ 
  isOpen, 
  onClose, 
  recipientName, 
  recipientId 
}: RatingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const submitRatingMutation = useMutation({
    mutationFn: async (data: { rating: number; review: string }) => {
      await apiRequest("POST", "/api/ratings", {
        toUserId: recipientId,
        rating: data.rating,
        review: data.review || null,
      });
    },
    onSuccess: () => {
      toast({
        title: "Rating submitted successfully",
        description: "Thank you for your feedback!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", recipientId] });
      queryClient.invalidateQueries({ queryKey: ["/api/ratings", recipientId] });
      queryClient.invalidateQueries({ queryKey: ["/api/ratings/top-rated"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ratings/stats"] });
      onClose();
      setRating(0);
      setReview("");
    },
    onError: (error) => {
      toast({
        title: "Error submitting rating",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "You must select at least one star.",
        variant: "destructive",
      });
      return;
    }
    submitRatingMutation.mutate({ rating, review });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {recipientName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Your Rating</Label>
            <div className="mt-2">
              <StarRating 
                rating={rating} 
                onRatingChange={setRating}
                size="lg"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="review">Review (Optional)</Label>
            <Textarea
              id="review"
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitRatingMutation.isPending}>
              {submitRatingMutation.isPending ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
