import "./global.css";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NGORegister from "./pages/NGORegister";
import About from "./pages/About";
import Placeholder from "./pages/Placeholder";
import NGODashboard from "./pages/NGODashboard";
import StudentDashboard from "./pages/StudentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ngo-register" element={<NGORegister />} />
          <Route path="/about" element={<About />} />
          <Route path="/ngo-dashboard" element={<NGODashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />

          {/* Additional placeholder routes */}
          <Route
            path="/how-it-works"
            element={
              <Placeholder
                title="How It Works"
                description="Learn how VolunteerConnect makes it easy to find and participate in meaningful volunteer opportunities."
                features={[
                  "Step-by-step guide for volunteers",
                  "NGO onboarding process",
                  "Event creation and management",
                  "Matching algorithm explanation",
                  "Success tips and best practices",
                ]}
              />
            }
          />
          <Route
            path="/post-event"
            element={
              <Placeholder
                title="Post an Event"
                description="Create and manage volunteer events to engage passionate students in your cause."
                features={[
                  "Event creation wizard",
                  "Volunteer requirement specification",
                  "Schedule and location management",
                  "Participant communication tools",
                  "Event analytics and reporting",
                ]}
              />
            }
          />
          <Route
            path="/resources"
            element={
              <Placeholder
                title="Resources"
                description="Access helpful resources, guides, and tools for successful volunteer event management."
                features={[
                  "Best practices guides",
                  "Event planning templates",
                  "Volunteer engagement strategies",
                  "Impact measurement tools",
                  "Community building resources",
                ]}
              />
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
