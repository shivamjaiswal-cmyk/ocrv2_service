import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import ConfigHierarchy from "./pages/ConfigHierarchy";
import PromptConfiguration from "./pages/PromptConfiguration";
import FieldMapping from "./pages/FieldMapping";
import OCRSandbox from "./pages/OCRSandbox";
import ValidationRules from "./pages/ValidationRules";
import MandatoryFields from "./pages/MandatoryFields";
import AuditTrail from "./pages/AuditTrail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/config-hierarchy" element={<ConfigHierarchy />} />
            <Route path="/prompt-config" element={<PromptConfiguration />} />
            <Route path="/field-mapping" element={<FieldMapping />} />
            <Route path="/ocr-sandbox" element={<OCRSandbox />} />
            <Route path="/validation-rules" element={<ValidationRules />} />
            <Route path="/mandatory-fields" element={<MandatoryFields />} />
            <Route path="/audit-trail" element={<AuditTrail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
