import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import TrainingSessionModal from "./TrainingSessionModal";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientId: string;
}

export default function ContactModal({ 
  isOpen, 
  onClose, 
  recipientName, 
  recipientId 
}: ContactModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [formData, setFormData] = useState({
    name: `${user?.firstName} ${user?.lastName}`,
    email: user?.email || "",
    subject: "Training inquiry",
    message: "",
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("/api/contact", "POST", {
        ...data,
        toUserId: recipientId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully",
        description: "Your message has been sent to the member.",
      });
      onClose();
      setFormData({
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email || "",
        subject: "Training inquiry",
        message: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact {recipientName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Your Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder={`Hi ${recipientName}, I'm interested in training...`}
              required
              className="w-full resize-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowTrainingModal(true)}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Calendar className="h-4 w-4" />
              Schedule Session
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button type="submit" disabled={sendMessageMutation.isPending} className="flex-1 sm:flex-none">
                <Mail className="h-4 w-4 mr-2" />
                {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
      
      {/* Training Session Modal */}
      <TrainingSessionModal
        isOpen={showTrainingModal}
        onClose={() => setShowTrainingModal(false)}
        partnerId={recipientId}
        partnerName={recipientName}
      />
    </Dialog>
  );
}
