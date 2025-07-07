import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/NotFound";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import ProfileDetail from "@/pages/ProfileDetail";
import ProfileEdit from "@/pages/ProfileEdit";
import MyProfile from "@/pages/MyProfile";
import Ratings from "@/pages/Ratings";
import InstructorNotes from "@/pages/InstructorNotes";
import GymFinder from "@/pages/GymFinder";
import Recommendations from "@/pages/Recommendations";
import TrainingSessions from "@/pages/TrainingSessions";
import UserGuide from "@/pages/UserGuide";
import Navbar from "@/components/Navbar";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log("Router state:", { isAuthenticated, isLoading, user });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/guide" component={UserGuide} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/explore" component={Explore} />
          <Route path="/profile/:id" component={ProfileDetail} />
          <Route path="/profile-edit" component={ProfileEdit} />
          <Route path="/my-profile" component={MyProfile} />
          <Route path="/ratings" component={Ratings} />
          <Route path="/instructor-notes" component={InstructorNotes} />
          <Route path="/gym-finder" component={GymFinder} />
          <Route path="/recommendations" component={Recommendations} />
          <Route path="/training-sessions" component={TrainingSessions} />
          <Route path="/guide" component={UserGuide} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;