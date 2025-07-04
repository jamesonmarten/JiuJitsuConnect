import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import ProfileDetail from "@/pages/ProfileDetail";
import ProfileEdit from "@/pages/ProfileEdit";
import MyProfile from "@/pages/MyProfile";
import Ratings from "@/pages/Ratings";
import Navbar from "@/components/Navbar";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Switch>
        {!isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Navbar />
            <Route path="/" component={Home} />
            <Route path="/explore" component={Explore} />
            <Route path="/profile/:id" component={ProfileDetail} />
            <Route path="/profile-edit" component={ProfileEdit} />
            <Route path="/my-profile" component={MyProfile} />
            <Route path="/ratings" component={Ratings} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
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