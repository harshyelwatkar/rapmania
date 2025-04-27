import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import AppPage from "@/pages/AppPage";
import DiscoverPage from "@/pages/DiscoverPage";
import ProfilePage from "@/pages/ProfilePage";
import { AuthProvider } from "@/hooks/useAuth";
import { RapProvider } from "@/contexts/RapContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/app" component={AppPage} />
      <Route path="/discover" component={DiscoverPage} />
      <Route path="/profile" component={ProfilePage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <RapProvider>
            <Toaster />
            <Router />
          </RapProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
