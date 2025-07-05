import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TrainingSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: string;
  partnerName: string;
}

export default function TrainingSessionModal({ 
  isOpen, 
  onClose, 
  partnerId, 
  partnerName 
}: TrainingSessionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    gymName: "",
    gymAddress: "",
    sessionDate: "",
    sessionTime: "",
    duration: "60",
    trainingType: "",
    notes: "",
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const sessionDateTime = new Date(`${sessionData.sessionDate}T${sessionData.sessionTime}`);
      
      return apiRequest("/api/training-sessions", "POST", {
        partnerId,
        gymName: sessionData.gymName,
        gymAddress: sessionData.gymAddress,
        sessionDate: sessionDateTime.toISOString(),
        duration: parseInt(sessionData.duration),
        trainingType: sessionData.trainingType,
        notes: sessionData.notes,
      });
    },
    onSuccess: () => {
      toast({
        title: "Training Session Scheduled",
        description: `Your training session with ${partnerName} has been scheduled successfully!`,
      });
      
      // Send a message to the partner about the session
      messageMutation.mutate({
        toUserId: partnerId,
        subject: "Training Session Scheduled",
        content: `I've scheduled a training session for us at ${formData.gymName} on ${formData.sessionDate} at ${formData.sessionTime}. Looking forward to training together!`,
        messageType: "training_invite",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/training-sessions"] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to schedule training session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const messageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      return apiRequest("/api/messages", "POST", messageData);
    },
  });

  const resetForm = () => {
    setFormData({
      gymName: "",
      gymAddress: "",
      sessionDate: "",
      sessionTime: "",
      duration: "60",
      trainingType: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gymName || !formData.sessionDate || !formData.sessionTime || !formData.trainingType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    createSessionMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Training Session
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Coordinate a training session with {partnerName}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gym Information */}
          <div className="space-y-2">
            <Label htmlFor="gymName">Gym/Location *</Label>
            <Input
              id="gymName"
              placeholder="e.g., ATT Orlando, Roufusport Orlando"
              value={formData.gymName}
              onChange={(e) => handleInputChange("gymName", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gymAddress">Address</Label>
            <Input
              id="gymAddress"
              placeholder="Full address (optional)"
              value={formData.gymAddress}
              onChange={(e) => handleInputChange("gymAddress", e.target.value)}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sessionDate">Date *</Label>
              <Input
                id="sessionDate"
                type="date"
                min={minDate}
                value={formData.sessionDate}
                onChange={(e) => handleInputChange("sessionDate", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sessionTime">Time *</Label>
              <Input
                id="sessionTime"
                type="time"
                value={formData.sessionTime}
                onChange={(e) => handleInputChange("sessionTime", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Training Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="trainingType">Training Type *</Label>
              <Select value={formData.trainingType} onValueChange={(value) => handleInputChange("trainingType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sparring">Sparring</SelectItem>
                  <SelectItem value="drilling">Drilling</SelectItem>
                  <SelectItem value="rolling">Rolling (BJJ)</SelectItem>
                  <SelectItem value="technique">Technique Work</SelectItem>
                  <SelectItem value="conditioning">Conditioning</SelectItem>
                  <SelectItem value="open_mat">Open Mat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any specific goals, equipment needed, or other details..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createSessionMutation.isPending}
            >
              {createSessionMutation.isPending ? "Scheduling..." : "Schedule Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}