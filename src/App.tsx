
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NewCampaignProvider } from "@/contexts/NewCampaignContext";
import { AuthProvider } from "@/contexts/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import Templates from "./pages/Templates";
import Leads from "./pages/Leads";
import LeadsImport from "./pages/LeadsImport";
import Campaigns from "./pages/Campaigns";
import NewCampaign from "./pages/NewCampaign";
import CampaignLeadSelection from "./pages/CampaignLeadSelection";
import CampaignConfirmation from "./pages/CampaignConfirmation";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import SequenceEditor from "./components/sequence/SequenceEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NewCampaignProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/index" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/campaigns" element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              } />
              <Route path="/campaigns/new" element={
                <ProtectedRoute>
                  <NewCampaign />
                </ProtectedRoute>
              } />
              <Route path="/campaigns/new/leads" element={
                <ProtectedRoute>
                  <CampaignLeadSelection />
                </ProtectedRoute>
              } />
              <Route path="/campaigns/new/confirm" element={
                <ProtectedRoute>
                  <CampaignConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/statistics" element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              } />
              <Route path="/templates" element={
                <ProtectedRoute>
                  <Templates />
                </ProtectedRoute>
              } />
              <Route path="/templates/:id/sequence" element={
                <ProtectedRoute>
                  <SequenceEditor />
                </ProtectedRoute>
              } />
              <Route path="/templates/new/sequence" element={
                <ProtectedRoute>
                  <SequenceEditor />
                </ProtectedRoute>
              } />
              <Route path="/leads" element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              } />
              <Route path="/leads/import" element={
                <ProtectedRoute>
                  <LeadsImport />
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NewCampaignProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
