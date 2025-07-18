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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Plus, 
  Send, 
  Users, 
  Calendar,
  Settings
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Form schemas
const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
});

type CreateGroupData = z.infer<typeof createGroupSchema>;
type SendMessageData = z.infer<typeof sendMessageSchema>;

export default function GroupMessages() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's groups
  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['/api/group-messages'],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch messages for selected group
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/group-messages', selectedGroup, 'chat'],
    enabled: !!selectedGroup,
    refetchInterval: 2000, // Refetch every 2 seconds for real-time feel
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: (data: CreateGroupData) => 
      apiRequest('/api/group-messages', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/group-messages'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ groupId, content }: { groupId: number; content: string }) =>
      apiRequest(`/api/group-messages/${groupId}/chat`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/group-messages', selectedGroup, 'chat'] 
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Forms
  const createGroupForm = useForm<CreateGroupData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const sendMessageForm = useForm<SendMessageData>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onCreateGroup = (data: CreateGroupData) => {
    createGroupMutation.mutate(data);
  };

  const onSendMessage = (data: SendMessageData) => {
    if (!selectedGroup) return;
    
    sendMessageMutation.mutate({
      groupId: selectedGroup,
      content: data.content,
    });
    
    sendMessageForm.reset();
  };

  const selectedGroupData = groups.find((g: any) => g.id === selectedGroup);

  return (
    <div className="container mx-auto p-4 h-screen max-h-screen overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-orange-600" />
            <h1 className="text-2xl font-bold">Group Messages</h1>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <Form {...createGroupForm}>
                <form onSubmit={createGroupForm.handleSubmit(onCreateGroup)} className="space-y-4">
                  <FormField
                    control={createGroupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter group name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createGroupForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter group description (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={createGroupMutation.isPending}>
                    {createGroupMutation.isPending ? "Creating..." : "Create Group"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
          {/* Groups List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                My Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                {groupsLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading groups...
                  </div>
                ) : groups.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No groups yet. Create your first group!
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    {groups.map((group: any) => (
                      <div
                        key={group.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedGroup === group.id
                            ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedGroup(group.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{group.name}</h3>
                            {group.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {group.description}
                              </p>
                            )}
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {group.memberCount || 0}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedGroupData ? (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    {selectedGroupData.name}
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    Select a group to start chatting
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {selectedGroup ? (
                <>
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {messagesLoading ? (
                      <div className="text-center text-muted-foreground">
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message: any) => (
                          <div key={message.id} className="flex gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                  {message.senderName?.charAt(0) || 'U'}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  {message.senderName || 'Unknown User'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.sentAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  
                  <Separator />
                  
                  {/* Message Input */}
                  <div className="p-4">
                    <Form {...sendMessageForm}>
                      <form onSubmit={sendMessageForm.handleSubmit(onSendMessage)} className="flex gap-2">
                        <FormField
                          control={sendMessageForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Type your message..."
                                  {...field}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      sendMessageForm.handleSubmit(onSendMessage)();
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={sendMessageMutation.isPending}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </Form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a group from the left to start messaging</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}