import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

interface TrainingSession {
  id: number;
  organizerId: string;
  partnerId: string;
  gymName: string;
  gymAddress: string;
  sessionDate: string;
  duration: number;
  trainingType: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  // Include partner info when we implement joins
  partnerName?: string;
}

export default function TrainingSessions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery<TrainingSession[]>({
    queryKey: ["/api/training-sessions"],
    queryFn: async () => {
      const response = await fetch("/api/training-sessions", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch training sessions");
      return response.json();
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      return apiRequest(`/api/training-sessions/${id}`, "PATCH", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-sessions"] });
      toast({
        title: "Session Updated",
        description: "Training session has been updated successfully.",
      });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/training-sessions/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-sessions"] });
      toast({
        title: "Session Deleted",
        description: "Training session has been deleted successfully.",
      });
    },
  });

  const createTestSessionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/create-test-session", "POST", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-sessions"] });
      toast({
        title: "Test Session Created",
        description: "A test training session has been created for debugging.",
      });
    },
  });

  const handleStatusUpdate = (sessionId: number, newStatus: string) => {
    updateSessionMutation.mutate({
      id: sessionId,
      updates: { status: newStatus }
    });
  };

  const handleDeleteSession = (sessionId: number) => {
    if (confirm("Are you sure you want to delete this training session?")) {
      deleteSessionMutation.mutate(sessionId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getTrainingTypeColor = (type: string) => {
    switch (type) {
      case "sparring":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "drilling":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "rolling":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "technique":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Training Sessions
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your scheduled training sessions and meetups
            </p>
          </div>
          <Button 
            onClick={() => createTestSessionMutation.mutate()}
            disabled={createTestSessionMutation.isPending}
            variant="outline"
            className="text-xs"
          >
            {createTestSessionMutation.isPending ? "Creating..." : "Create Test Session"}
          </Button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No training sessions scheduled</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start connecting with training partners to schedule your first session!
          </p>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Find Training Partners
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {session.gymName}
                  </CardTitle>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {session.partnerName && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4" />
                    Training with {session.partnerName}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(session.sessionDate), "EEEE, MMMM do, yyyy")}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4" />
                  {format(new Date(session.sessionDate), "h:mm a")} ({session.duration} min)
                </div>
                
                {session.gymAddress && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    {session.gymAddress}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge className={getTrainingTypeColor(session.trainingType)}>
                    {session.trainingType}
                  </Badge>
                </div>
                
                {session.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 border-l-2 border-gray-200 pl-3">
                    {session.notes}
                  </p>
                )}
                
                <div className="flex gap-2 pt-4 border-t">
                  {session.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(session.id, "confirmed")}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(session.id, "cancelled")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  
                  {session.status === "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(session.id, "completed")}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}