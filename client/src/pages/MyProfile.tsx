import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Camera, Video, Plus, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

export default function MyProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Journal Entry State
  const [journalDialogOpen, setJournalDialogOpen] = useState(false);
  const [journalForm, setJournalForm] = useState({
    title: "",
    content: "",
    mood: "",
    trainingType: "",
  });

  // Training Media State
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [mediaForm, setMediaForm] = useState({
    title: "",
    description: "",
    mediaType: "photo",
    mediaUrl: "",
    isPublic: false,
    techniques: "",
    trainingPartners: "",
  });

  // Fetch data
  const { data: journalEntries = [] } = useQuery({
    queryKey: ["/api/journal-entries"],
    enabled: !!user,
  });

  const { data: trainingMedia = [] } = useQuery({
    queryKey: ["/api/training-media"],
    enabled: !!user,
  });

  const { data: instructorNotes = [] } = useQuery({
    queryKey: ["/api/instructor-notes", user?.id],
    enabled: !!user,
  });

  // Mutations
  const createJournalMutation = useMutation({
    mutationFn: async (data: typeof journalForm) => {
      await apiRequest("POST", "/api/journal-entries", data);
    },
    onSuccess: () => {
      toast({ title: "Journal entry created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      setJournalDialogOpen(false);
      setJournalForm({ title: "", content: "", mood: "", trainingType: "" });
    },
    onError: (error) => {
      toast({ title: "Error creating journal entry", description: error.message, variant: "destructive" });
    },
  });

  const createMediaMutation = useMutation({
    mutationFn: async (data: any) => {
      const mediaData = {
        ...data,
        techniques: data.techniques ? data.techniques.split(",").map((t: string) => t.trim()) : [],
        trainingPartners: data.trainingPartners ? data.trainingPartners.split(",").map((p: string) => p.trim()) : [],
      };
      await apiRequest("POST", "/api/training-media", mediaData);
    },
    onSuccess: () => {
      toast({ title: "Training media added successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/training-media"] });
      setMediaDialogOpen(false);
      setMediaForm({
        title: "",
        description: "",
        mediaType: "photo",
        mediaUrl: "",
        isPublic: false,
        techniques: "",
        trainingPartners: "",
      });
    },
    onError: (error) => {
      toast({ title: "Error adding training media", description: error.message, variant: "destructive" });
    },
  });

  const deleteJournalMutation = useMutation({
    mutationFn: async (entryId: number) => {
      await apiRequest("DELETE", `/api/journal-entries/${entryId}`, {});
    },
    onSuccess: () => {
      toast({ title: "Journal entry deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
    },
    onError: (error) => {
      toast({ title: "Error deleting journal entry", description: error.message, variant: "destructive" });
    },
  });

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJournalMutation.mutate(journalForm);
  };

  const handleMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMediaMutation.mutate(mediaForm);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Training Profile</h1>
      </div>

      <Tabs defaultValue="journal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="journal">Training Journal</TabsTrigger>
          <TabsTrigger value="media">Media Gallery</TabsTrigger>
          <TabsTrigger value="instructor-notes">Instructor Notes</TabsTrigger>
        </TabsList>

        {/* Journal Tab */}
        <TabsContent value="journal">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Training Journal
              </CardTitle>
              <Dialog open={journalDialogOpen} onOpenChange={setJournalDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>New Journal Entry</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleJournalSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={journalForm.title}
                        onChange={(e) => setJournalForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="mood">Mood</Label>
                      <Select value={journalForm.mood} onValueChange={(value) => setJournalForm(prev => ({ ...prev, mood: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="How did you feel?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="motivated">Motivated</SelectItem>
                          <SelectItem value="confident">Confident</SelectItem>
                          <SelectItem value="frustrated">Frustrated</SelectItem>
                          <SelectItem value="tired">Tired</SelectItem>
                          <SelectItem value="excited">Excited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="trainingType">Training Type</Label>
                      <Select value={journalForm.trainingType} onValueChange={(value) => setJournalForm(prev => ({ ...prev, trainingType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="What type of training?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sparring">Sparring</SelectItem>
                          <SelectItem value="drilling">Drilling</SelectItem>
                          <SelectItem value="technique">Technique Practice</SelectItem>
                          <SelectItem value="conditioning">Conditioning</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        rows={4}
                        value={journalForm.content}
                        onChange={(e) => setJournalForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Describe your training session, what you learned, challenges faced..."
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setJournalDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createJournalMutation.isPending}>
                        {createJournalMutation.isPending ? "Saving..." : "Save Entry"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {journalEntries && journalEntries.length > 0 ? (
                <div className="space-y-4">
                  {journalEntries.map((entry: any) => (
                    <Card key={entry.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{entry.title}</h4>
                          <div className="flex gap-2">
                            {entry.mood && (
                              <Badge variant="secondary">{entry.mood}</Badge>
                            )}
                            {entry.trainingType && (
                              <Badge variant="outline">{entry.trainingType}</Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteJournalMutation.mutate(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-2">{entry.content}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(entry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No journal entries yet. Start documenting your training journey!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Training Media
              </CardTitle>
              <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Media
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Training Media</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleMediaSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="mediaTitle">Title</Label>
                      <Input
                        id="mediaTitle"
                        value={mediaForm.title}
                        onChange={(e) => setMediaForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="mediaType">Media Type</Label>
                      <Select value={mediaForm.mediaType} onValueChange={(value) => setMediaForm(prev => ({ ...prev, mediaType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select media type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="photo">Photo</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="mediaUrl">Media URL</Label>
                      <Input
                        id="mediaUrl"
                        type="url"
                        value={mediaForm.mediaUrl}
                        onChange={(e) => setMediaForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                        placeholder="https://..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={3}
                        value={mediaForm.description}
                        onChange={(e) => setMediaForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what happened in this training session..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="techniques">Techniques (comma separated)</Label>
                      <Input
                        id="techniques"
                        value={mediaForm.techniques}
                        onChange={(e) => setMediaForm(prev => ({ ...prev, techniques: e.target.value }))}
                        placeholder="armbar, triangle, guard pass"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trainingPartners">Training Partners (comma separated)</Label>
                      <Input
                        id="trainingPartners"
                        value={mediaForm.trainingPartners}
                        onChange={(e) => setMediaForm(prev => ({ ...prev, trainingPartners: e.target.value }))}
                        placeholder="John, Sarah, Mike"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={mediaForm.isPublic}
                        onChange={(e) => setMediaForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                      />
                      <Label htmlFor="isPublic">Make this public to the community</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setMediaDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMediaMutation.isPending}>
                        {createMediaMutation.isPending ? "Saving..." : "Add Media"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {trainingMedia && trainingMedia.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainingMedia.map((media: any) => (
                    <Card key={media.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {media.mediaType === 'photo' ? (
                            <Camera className="h-4 w-4" />
                          ) : (
                            <Video className="h-4 w-4" />
                          )}
                          <h4 className="font-semibold text-sm">{media.title}</h4>
                        </div>
                        {media.description && (
                          <p className="text-sm text-muted-foreground mb-2">{media.description}</p>
                        )}
                        {media.techniques && media.techniques.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {media.techniques.map((technique: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {technique}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(media.createdAt), "MMM d, yyyy")}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No training media yet. Start capturing your progress!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instructor Notes Tab */}
        <TabsContent value="instructor-notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Instructor Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {instructorNotes && instructorNotes.length > 0 ? (
                <div className="space-y-4">
                  {instructorNotes.map((note: any) => (
                    <Card key={note.id} className="border-l-4 border-l-secondary">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{note.title}</h4>
                          <Badge variant="secondary">Instructor Note</Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{note.content}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No instructor notes yet. Your instructors can add notes about your progress here.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}