import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Heart,
  Plus,
  Calendar as CalendarIcon,
  Users,
  BarChart3,
  Settings,
  MapPin,
  Clock,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Award,
  LogOut,
} from "lucide-react";
import { Link, redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

const eventSchema = z.object({
  title: z.string().min(5, "Event title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  cause: z.array(z.string()).min(1, "Please select a cause"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  date: z.date({
    required_error: "Please select a date for the event",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  volunteersNeeded: z
    .string()
    .min(1, "Number of volunteers needed is required"),
  skills: z.array(z.string()).optional(),
  requirements: z.string().optional(),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

type EventForm = z.infer<typeof eventSchema>;

// Mock data for demonstration
const mockEvents = [
  {
    id: 1,
    title: "Community Garden Cleanup",
    cause: "Environment",
    date: "2024-02-15",
    location: "Aga Khan Palace Community Garden",
    volunteersNeeded: 15,
    volunteersRegistered: 12,
    status: "Published",
  },
  {
    id: 2,
    title: "Youth Coding Workshop",
    cause: "Education",
    date: "2024-02-20",
    location: "Rajiv Gandhi IT Park",
    volunteersNeeded: 8,
    volunteersRegistered: 6,
    status: "Published",
  },
  {
    id: 3,
    title: "Food Bank Distribution",
    cause: "Community",
    date: "2024-02-25",
    location: "Shaniwar Peth Community Center",
    volunteersNeeded: 20,
    volunteersRegistered: 18,
    status: "Draft",
  },
];

const mockVolunteers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@university.edu",
    university: "State University",
    skills: "Teaching, Communication",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@college.edu",
    university: "Tech College",
    skills: "Programming, Web Design",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@uni.edu",
    university: "Community College",
    skills: "Gardening, Organization",
  },
];

export default function NGODashboard() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [eventVolunteers, setEventVolunteers] = useState([]);

  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      cause: [""],
      location: "",
      startTime: "",
      endTime: "",
      volunteersNeeded: "",
      skills: [""],
      requirements: "",
      address: "",
    },
  });
  const [userStats, setUserStats] = useState({
    'total_events': 0,
    'volunteers': 0,
    'completed_events': 0,
    'avgrating': 0
  });
  const [user, setUser] = useState(() => {
    // Try to load from localStorage, else use default
    const stored = localStorage.getItem("studentUser");
    if (stored) return JSON.parse(stored);
    return {
      username: "Your Organization",
      email: "",
      location: "",
      slug: "",
      contact: "",
    };
  });
  const [NgoEvents, setNgoEvents] = useState([]);
  const [NgoVolunteers, setNgoVolunteers] = useState([]);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);

  const fetchEventDetails = async (eventId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:8000/api/ngo/event/${eventId}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedEvent(data);
        setEventVolunteers(data.volunteers || []);
        console.log("Fetched event details:", data);
      } else {
        console.error("Failed to fetch event details:", response.status);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const handleViewEvent = async (event: any) => {
    console.log("View event clicked:", event);
    await fetchEventDetails(event.eventid);
    setIsViewEventOpen(true);
  };

  const handleEditEvent = async (event: any) => {
    console.log("Edit event clicked:", event);
    await fetchEventDetails(event.eventid);
    setIsEditEventOpen(true);
  };

  const editForm = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
  });

  // Populate edit form when selectedEvent changes
  useEffect(() => {
    if (selectedEvent && isEditEventOpen) {
      editForm.reset({
        title: selectedEvent.title || '',
        description: selectedEvent.description || '',
        address: selectedEvent.address || '',
        volunteersNeeded: selectedEvent.volunteers_needed?.toString() || '',
        date: selectedEvent.start_datetime ? new Date(selectedEvent.start_datetime) : undefined,
        startTime: selectedEvent.start_datetime ? 
          new Date(selectedEvent.start_datetime).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          }) : '',
        endTime: selectedEvent.end_datetime ? 
          new Date(selectedEvent.end_datetime).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          }) : '',
        cause: selectedEvent.causes || [],
        location: selectedEvent.location || '',
        skills: selectedEvent.skills || [],
        requirements: ''
      });
    }
  }, [selectedEvent, isEditEventOpen]);

  const onEditSubmit = async (data: EventForm) => {
    if (!selectedEvent) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:8000/api/ngo/event/${selectedEvent.eventid}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          address: data.address,
          volunteers_needed: parseInt(data.volunteersNeeded),
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : null,
          start_time: data.startTime,
          end_time: data.endTime,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Backend error:", errData);
        alert(`Error: ${errData.message || "Failed to update event"}`);
        return;
      }

      const result = await response.json();
      console.log("Event updated successfully:", result);
      
      if (result.notifications_sent) {
        alert("✅ Event updated successfully! Volunteers have been notified of the changes.");
      } else {
        alert("✅ Event updated successfully!");
      }

      setIsEditEventOpen(false);
      // Refresh events list
      window.location.reload();
    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while updating the event. Please try again.");
    }
  };

  const handleLogout = () => {
    // 🧹 Remove tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Optional: clear any user-related info
    localStorage.removeItem("userType");

    // 🚪 Redirect to login page
    redirect("/login");
  };

  const onSubmit = async (data) => {
    try {
      // Log the form data for debugging
      console.log("Submitting Event Data:", data);
      const token = localStorage.getItem("accessToken");
      console.log("Using token:", token);
      const response = await fetch("http://127.0.0.1:8000/api/ngo/createevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you have authentication:
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          cause: data.cause,
          volunteers_needed: parseInt(data.volunteersNeeded),
          location: data.location,
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : null, // format to YYYY-MM-DD
          start_time: data.startTime,
          end_time: data.endTime,
          skills: data.skills || "",
          requirements: data.requirements || "",
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Backend error:", errData);
        alert(`Error: ${errData.detail || "Failed to create event"}`);
        return;
      }

      const result = await response.json();
      console.log("Event created successfully:", result);
      alert("🎉 Event created successfully!");

      // Optionally reset form or close modal
      form.reset();
      setIsCreateEventOpen(false);

    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while creating the event. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        console.log("Using token:", token);
        if (!token) return; // user not logged in

        const response = await fetch("http://127.0.0.1:8000/api/ngo/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          console.log("Fetched ngo data:", data);
          localStorage.setItem("studentUser", JSON.stringify(data));
        } else if (response.status === 401) {
          console.warn("Token expired or invalid — consider refreshing here");
          console.log("Redirecting to login due to invalid token");
          window.location.href = "/";
        } else {
          console.error("Failed to fetch user data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return; // user not logged in

        const response = await fetch("http://127.0.0.1:8000/api/ngostats/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserStats(data);
          console.log("Fetched user stats:", data);
        } else if (response.status === 401) {
          console.warn("Token expired or invalid — consider refreshing here");
        } else {
          console.error("Failed to fetch ngo data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchRegisteredEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return; // user not logged in

        const response = await fetch("http://127.0.0.1:8000/api/ngoregistrations/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNgoEvents(data);
          console.log("Fetched user registered events:", data);
        } else if (response.status === 401) {
          console.warn("Token expired or invalid — consider refreshing here");
        } else {
          console.error("Failed to fetch user data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchNgoVolunteers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await fetch("http://127.0.0.1:8000/api/ngo/volunteers/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNgoVolunteers(data);
          console.log("Fetched NGO volunteers:", data);
        } else if (response.status === 401) {
          console.warn("Token expired or invalid");
        } else {
          console.error("Failed to fetch volunteers:", response.status);
        }
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };


    fetchUserData();
    fetchRegisteredEvents();
    fetchUserStats();
    fetchNgoVolunteers();

  }, []);





  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Vertical Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white flex flex-col shadow-xl">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-blue-500">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <span className="text-lg font-bold block">VolunteerConnect</span>
              <Badge variant="secondary" className="text-xs bg-blue-500 text-white border-none">
                NGO Dashboard
              </Badge>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "overview"
                ? "bg-white text-blue-600 shadow-md"
                : "text-white hover:bg-blue-500"
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "events"
                ? "bg-white text-blue-600 shadow-md"
                : "text-white hover:bg-blue-500"
            }`}
          >
            <CalendarIcon className="h-5 w-5" />
            <span className="font-medium">Events</span>
          </button>

          <button
            onClick={() => setActiveTab("volunteers")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "volunteers"
                ? "bg-white text-blue-600 shadow-md"
                : "text-white hover:bg-blue-500"
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Volunteers</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "analytics"
                ? "bg-white text-blue-600 shadow-md"
                : "text-white hover:bg-blue-500"
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">Analytics</span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-blue-500 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-500"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-500"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.username || "Your Organization"}
            </h1>
            <p className="text-sm text-gray-500">
              Manage your volunteer events and community impact
            </p>
          </div>
          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new volunteer event for your
                  organization.
                </DialogDescription>
              </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Community Garden Cleanup"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what volunteers will be doing, the impact of this event, and any other relevant details..."
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    <FormField
                      control={form.control}
                      name="cause"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Causes</FormLabel>
                          <FormDescription>
                            Select one or more causes that best represent the focus of your event.
                          </FormDescription>
                          <FormControl>
                            <div className="flex flex-wrap gap-3 mt-2">
                              {[
                                'Education',
                                'Environment',
                                'Health',
                                'Community Development',
                                'Animal Welfare',
                                'Arts and Culture'
                              ].map((interest) => {
                                const isSelected = field.value?.includes(interest);
                                return (
                                  <button
                                    key={interest}
                                    type="button"
                                    onClick={() => {
                                      const updatedValue = isSelected
                                        ? field.value?.filter((val) => val !== interest) || []
                                        : [...(field.value || []), interest];
                                      field.onChange(updatedValue);
                                    }}
                                    style={{
                                      backgroundColor: isSelected ? '#10b981' : '#f3f4f6',
                                      color: isSelected ? '#ffffff' : '#374151',
                                      border: isSelected ? '2px solid #059669' : '2px solid #e5e7eb',
                                      transition: 'all 0.2s ease',
                                    }}
                                    className="px-4 py-2 rounded-lg font-medium hover:shadow-md transform hover:scale-105 active:scale-95"
                                  >
                                    {interest}
                                  </button>
                                );
                              })}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Kalyani Nagar">Kalyani Nagar</SelectItem>
                              <SelectItem value="Hinjewadi">Hinjewadi</SelectItem>
                              <SelectItem value="Shaniwar Peth">Shaniwar Peth</SelectItem>
                              <SelectItem value="Koregaon Park">Koregaon Park</SelectItem>
                              <SelectItem value="Pashan">Pashan</SelectItem>
                              <SelectItem value="Sadashiv Peth">Sadashiv Peth</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main Street, City, State"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Event Date</FormLabel>

                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"
                                      }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>

                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        )}
                      />


                      <FormField
                        control={form.control}
                        name="volunteersNeeded"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Volunteers Needed</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="15"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skills Preferred</FormLabel>
                          <FormDescription>
                            Select all skills you would like volunteers to have for this event.
                          </FormDescription>
                          <FormControl>
                            <div className="flex flex-wrap gap-3 mt-2">
                              {[
                                'Programming',
                                'Teaching',
                                'Fundraising',
                                'Event Planning',
                                'Social Media',
                                'Photography',
                                'Public Speaking'
                              ].map((skill) => {
                                const isSelected = field.value?.includes(skill);
                                return (
                                  <button
                                    key={skill}
                                    type="button"
                                    onClick={() => {
                                      const updatedValue = isSelected
                                        ? field.value?.filter((val) => val !== skill) || []
                                        : [...(field.value || []), skill];
                                      field.onChange(updatedValue);
                                    }}
                                    style={{
                                      backgroundColor: isSelected ? '#10b981' : '#f3f4f6',
                                      color: isSelected ? '#ffffff' : '#374151',
                                      border: isSelected ? '2px solid #059669' : '2px solid #e5e7eb',
                                      transition: 'all 0.2s ease',
                                    }}
                                    className="px-4 py-2 rounded-lg font-medium hover:shadow-md transform hover:scale-105 active:scale-95"
                                  >
                                    {skill}
                                  </button>
                                );
                              })}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1">
                        Create Event
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateEventOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </header>

          {/* Main Content - Scrollable */}
          <main className="flex-1 overflow-y-auto p-8">
            {/* Stats Cards - Always Visible */}
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total Events
                      </CardTitle>
                      <CalendarIcon className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">{userStats.total_events}</div>
                      <p className="text-xs text-gray-500 mt-1">All time</p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Active Volunteers
                      </CardTitle>
                      <Users className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">{userStats.volunteers}</div>
                      <p className="text-xs text-gray-500 mt-1">Total registrations</p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Events Completed
                      </CardTitle>
                      <Clock className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">{userStats.completed_events}</div>
                      <p className="text-xs text-gray-500 mt-1">Successfully finished</p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Rating
                      </CardTitle>
                      <TrendingUp className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      {userStats.avgrating > 0 ? (
                        <>
                          <div className="text-3xl font-bold text-gray-900">{userStats.avgrating.toFixed(1)} ⭐</div>
                          <p className="text-xs text-gray-500 mt-1">Average rating</p>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-gray-900">New Org</div>
                          <p className="text-xs text-gray-500 mt-1">No ratings yet</p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Overview Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Events</CardTitle>
                      <CardDescription>
                        Your next scheduled volunteer events
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {NgoEvents && NgoEvents.length > 0 ? (
                        NgoEvents.filter(e => e.status === 'Upcoming' || e.status === 'Published').slice(0, 3).map((event) => (
                          <div
                            key={event.eventid}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })} • {event.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  event.status === "Published" || event.status === "Upcoming"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {event.status}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.volunteersRegistered}/{event.volunteersNeeded}{" "}
                                volunteers
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-500 mb-4">
                            No upcoming events. Create your first event to get started!
                          </p>
                          <Button onClick={() => setIsCreateEventOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Event
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Volunteer Activity</CardTitle>
                      <CardDescription>
                        Latest volunteers who joined your events
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {NgoVolunteers && NgoVolunteers.length > 0 ? (
                        NgoVolunteers.slice(0, 3).map((volunteer) => (
                          <div
                            key={volunteer.id}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {volunteer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{volunteer.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {volunteer.college}
                              </p>
                            </div>
                            <Badge variant="outline">{volunteer.events_joined} events</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No volunteers yet. Create events to get volunteers!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            {/* Events Tab Content */}
            {activeTab === "events" && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Management</CardTitle>
                  <CardDescription>
                    Create, edit, and manage your volunteer events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Volunteers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {NgoEvents.map((event) => (
                      <TableRow key={event.eventid}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.cause}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>
                              {event.volunteersRegistered}/
                              {event.volunteersNeeded}
                            </span>
                            <Progress
                              value={
                                (event.volunteersRegistered /
                                  event.volunteersNeeded) *
                                100
                              }
                              className="w-16"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              event.status === "Published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewEvent(event)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            )}

          {/* Volunteers Tab Content */}
          {activeTab === "volunteers" && (
            <Card>
              <CardHeader>
                <CardTitle>Your Volunteers</CardTitle>
                <CardDescription>
                  Students who have volunteered for your organization's events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {NgoVolunteers && NgoVolunteers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Volunteer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Major</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Events Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {NgoVolunteers.map((volunteer) => (
                        <TableRow key={volunteer.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {volunteer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {volunteer.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{volunteer.email}</TableCell>
                          <TableCell>{volunteer.college}</TableCell>
                          <TableCell>{volunteer.major}</TableCell>
                          <TableCell className="max-w-xs truncate">{volunteer.skills}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{volunteer.events_joined} events</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Create and publish events to start attracting volunteers
                    </p>
                    <Button onClick={() => setIsCreateEventOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Analytics Tab Content */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Engagement</CardTitle>
                  <CardDescription>
                    Track volunteer participation and retention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Volunteers</span>
                      <span className="font-bold">{userStats.volunteers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Events Completed</span>
                      <span className="font-bold">{userStats.completed_events}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Rating</span>
                      <span className="font-bold">
                        {userStats.avgrating > 0 ? `${userStats.avgrating.toFixed(1)} ⭐` : 'Not rated yet'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization Status</CardTitle>
                  <CardDescription>
                    Your organization's current standing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Events Created</span>
                      <span className="font-bold">{userStats.total_events}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Events</span>
                      <span className="font-bold">
                        {NgoEvents.filter(e => e.status === 'Published' || e.status === 'Upcoming').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Organization Level</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">
                          {userStats.avgrating === 0 ? 'New Organization' : 
                           userStats.avgrating < 3 ? 'Growing' :
                           userStats.avgrating < 4 ? 'Established' : 'Top Rated'}
                        </span>
                        {userStats.avgrating >= 4 && <Award className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* View Event Dialog */}
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.causes?.join(", ")}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              {/* Event Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(selectedEvent.start_datetime).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {new Date(selectedEvent.start_datetime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {new Date(selectedEvent.end_datetime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedEvent.address}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Volunteers</p>
                  <p className="font-medium">
                    {selectedEvent.volunteers_registered} / {selectedEvent.volunteers_needed}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge>{selectedEvent.status}</Badge>
                </div>
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div>
                  <p className="text-muted-foreground mb-2 font-medium">Description</p>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>
              )}

              {/* Registered Volunteers */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Registered Volunteers ({eventVolunteers.length})</h3>
                {eventVolunteers.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>College</TableHead>
                          <TableHead>Major</TableHead>
                          <TableHead>Skills</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventVolunteers.map((volunteer: any) => (
                          <TableRow key={volunteer.id}>
                            <TableCell className="font-medium">{volunteer.name}</TableCell>
                            <TableCell>{volunteer.email}</TableCell>
                            <TableCell>{volunteer.college}</TableCell>
                            <TableCell>{volunteer.major}</TableCell>
                            <TableCell className="max-w-xs truncate">{volunteer.skills}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{volunteer.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No volunteers registered yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update event details. Changes to address, date, or time will notify all registered volunteers.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Community Garden Cleanup"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the event..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main Street, City, State"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="volunteersNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volunteers Needed</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Update Event
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditEventOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
