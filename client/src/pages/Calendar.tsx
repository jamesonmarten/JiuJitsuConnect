import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  Users,
  CheckCircle,
  XCircle,
  Clock3
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Form schemas
const createEventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().optional(),
  eventType: z.enum(["meeting", "training", "competition", "social"]),
});

type CreateEventData = z.infer<typeof createEventSchema>;

export default function Calendar() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's calendar events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/calendar-events'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch upcoming events
  const { data: upcomingEvents = [], isLoading: upcomingLoading } = useQuery({
    queryKey: ['/api/calendar-events/upcoming'],
    refetchInterval: 30000,
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: (data: CreateEventData) => 
      apiRequest('/api/calendar-events', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar-events'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    },
  });

  // Update participant status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ eventId, userId, status }: { eventId: number; userId: string; status: string }) =>
      apiRequest(`/api/calendar-events/${eventId}/participants/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar-events'] });
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    },
  });

  // Form
  const createEventForm = useForm<CreateEventData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      eventType: "meeting",
    },
  });

  const onCreateEvent = (data: CreateEventData) => {
    createEventMutation.mutate(data);
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "training":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "competition":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "social":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "declined":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock3 className="h-4 w-4 text-yellow-600" />;
    }
  };

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-orange-600" />
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Event</DialogTitle>
            </DialogHeader>
            <Form {...createEventForm}>
              <form onSubmit={createEventForm.handleSubmit(onCreateEvent)} className="space-y-4">
                <FormField
                  control={createEventForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createEventForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter event description (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createEventForm.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createEventForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time *</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createEventForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time *</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createEventForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event location (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={createEventMutation.isPending} className="w-full">
                  {createEventMutation.isPending ? "Creating..." : "Schedule Event"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              {upcomingLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading upcoming events...
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No upcoming events
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event: any) => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(event.startTime).toLocaleDateString()} at{" "}
                            {new Date(event.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {event.location && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </p>
                          )}
                        </div>
                        <Badge className={getEventTypeColor(event.eventType)}>
                          {event.eventType}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* All Events */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              All Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              {eventsLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading events...
                </div>
              ) : sortedEvents.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No events scheduled. Create your first event!
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedEvents.map((event: any) => (
                    <div
                      key={event.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge className={getEventTypeColor(event.eventType)}>
                              {event.eventType}
                            </Badge>
                          </div>
                          
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {event.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.startTime).toLocaleDateString()} at{" "}
                              {new Date(event.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusIcon(event.userStatus || 'pending')}
                          <Badge variant="outline">
                            {event.participantCount || 0} participants
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getEventTypeColor(selectedEvent.eventType)}>
                  {selectedEvent.eventType}
                </Badge>
                <div className="flex items-center gap-1">
                  {getStatusIcon(selectedEvent.userStatus || 'pending')}
                  <span className="text-sm capitalize">
                    {selectedEvent.userStatus || 'pending'}
                  </span>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.description}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Start Time</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEvent.startTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">End Time</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEvent.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {selectedEvent.location && (
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedEvent.location}
                  </p>
                </div>
              )}
              
              <Separator />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatusMutation.mutate({
                    eventId: selectedEvent.id,
                    userId: 'current-user', // This would be the actual user ID
                    status: 'accepted'
                  })}
                  disabled={updateStatusMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatusMutation.mutate({
                    eventId: selectedEvent.id,
                    userId: 'current-user', // This would be the actual user ID
                    status: 'declined'
                  })}
                  disabled={updateStatusMutation.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}