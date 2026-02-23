import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  Search,
  Calendar as CalendarIcon,
  Users,
  Clock,
  MapPin,
  Filter,
  BookOpen,
  Award,
  TrendingUp,
  Settings,
  LogOut,
  Star,
  UserCheck,
  Globe,
  Mail,
  CheckCircle,
} from "lucide-react";
import { Link, redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { set } from "date-fns";

// Mock data for demonstration
const mockRecommendedEvents = [
  {
    id: 1,
    title: "Community Garden Cleanup",
    organization: "Green Earth Initiative",
    cause: "Environment",
    date: "2024-02-15",
    time: "9:00 AM - 1:00 PM",
    location: "Aga Khan Palace Community Garden",
    volunteersNeeded: 15,
    volunteersRegistered: 12,
    description:
      "Help clean and maintain our community garden. No experience needed!",
    skills: ["Gardening", "Physical Labor"],
    difficulty: "Easy",
    impact: "High",
  },
  {
    id: 2,
    title: "Youth Coding Workshop",
    organization: "Tech for All",
    cause: "Education",
    date: "2024-02-20",
    time: "2:00 PM - 5:00 PM",
    location: "Rajiv Gandhi IT Park",
    volunteersNeeded: 8,
    volunteersRegistered: 6,
    description:
      "Teach basic programming concepts to underprivileged youth aged 12-16.",
    skills: ["Programming", "Teaching"],
    difficulty: "Medium",
    impact: "Very High",
  },
  {
    id: 3,
    title: "Food Bank Distribution",
    organization: "Community Care Network",
    cause: "Community",
    date: "2024-02-25",
    time: "8:00 AM - 12:00 PM",
    location: "Shaniwar Peth Community Center",
    volunteersNeeded: 20,
    volunteersRegistered: 18,
    description: "Sort and distribute food packages to families in need.",
    skills: ["Organization", "Communication"],
    difficulty: "Easy",
    impact: "High",
  },
];

const mockRegisteredEvents = [
  {
    id: 4,
    title: "Lake Cleanup Day",
    organization: "Ocean Conservation Society",
    cause: "Environment",
    date: "2024-02-10",
    time: "7:00 AM - 11:00 AM",
    location: "Pashan Lake",
    status: "Upcoming",
  },
  {
    id: 5,
    title: "Senior Center Visit",
    organization: "Elder Care Foundation",
    cause: "Community",
    date: "2024-02-18",
    time: "1:00 PM - 4:00 PM",
    location: "Koregaon Park Senior Center",
    status: "Upcoming",
  },
];

const mockAchievements = [
  {
    id: 1,
    title: "First Event",
    description: "Completed your first volunteer event",
    earned: true,
    icon: "🎉",
  },
  {
    id: 2,
    title: "Environment Champion",
    description: "Participated in 5 environmental events",
    earned: true,
    icon: "🌱",
  },
  {
    id: 3,
    title: "Community Builder",
    description: "Volunteered 25 hours in community events",
    earned: false,
    icon: "🏘️",
  },
  {
    id: 4,
    title: "Teaching Star",
    description: "Led 3 educational workshops",
    earned: false,
    icon: "⭐",
  },
];

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [causeFilter, setCauseFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("discover");
  const [RecommendedEvents, setRecommendedEvents] = useState(mockRecommendedEvents);
  const [RegisteredEvents, setRegisteredEvents] = useState(mockRegisteredEvents);
  const [userStats, setUserStats] = useState({
    total_events: 0,
    user_events: 0,
    completed_events: 0,
    organizations_helped: 0,
    impactLevel: "Beginner",
  });
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Try to load from localStorage, else use default
    const stored = localStorage.getItem("studentUser");
    if (stored) return JSON.parse(stored);
    return {
      username: "Sarah Johnson",
      email: "sarah@university.edu",
      location: "State University",
      slug: "sarah-johnson",
      major: "Computer Science",
      contact: "123-456-7890",
    };
  });

  // Modal and OTP states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        console.log("Using token:", token);
        if (!token) return; // user not logged in

        const response = await fetch("http://127.0.0.1:8000/api/user/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setRecommendedEvents(data.recommended_events);
          console.log("Fetched user data:", data);
          localStorage.setItem("studentUser", JSON.stringify(data));
        } else if (response.status === 401) {
          console.warn("Token expired or invalid — consider refreshing here");
          console.log("Redirecting to login due to invalid token");
          window.location.href = "/";
        } else {
          console.error("Failed to fetch user data:", response.status);
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return; // user not logged in

        const response = await fetch("http://127.0.0.1:8000/api/userstats/", {
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
          console.error("Failed to fetch user data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchRegisteredEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return; // user not logged in

        const response = await fetch("http://127.0.0.1:8000/api/userregistrations/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRegisteredEvents(data);
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

    fetchUserStats();
    fetchUserData();
    fetchRegisteredEvents();
  }, []);

  if (!user) return <p>Loading user info...</p>;

  // Handle opening registration modal
  const handleRegisterClick = (event) => {
    console.log("Registering for event:", event);
    setSelectedEvent(event);
    setIsModalOpen(true);
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpSuccess(false);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpSuccess(false);
  };

  // Send OTP
  const handleSendOtp = async () => {
    setIsLoadingOtp(true);
    setOtpError("");
    console.log("Sending OTP to:", user.email);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://127.0.0.1:8000/api/send-otp/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      if (response.ok) {
        setOtpSent(true);
        setOtpError("");
      } else {
        const errorData = await response.json();
        setOtpError(errorData.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpError("An error occurred while sending OTP. Please try again.");
    } finally {
      setIsLoadingOtp(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (id: number) => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setOtpError("Please enter a complete 6-digit OTP.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://127.0.0.1:8000/api/verify-otp/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          otp: otpString,
          
        }),
      });

      if (response.ok) {
        setOtpSuccess(true);
        console.log("OTP verified successfully for event ID:", id);
        setOtpError("");
        const response = await fetch("http://127.0.0.1:8000/api/setevent/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          id: id,
        }),
      });
        
        
        // Close modal after successful verification
        setTimeout(() => {
          handleCloseModal();
          // Show success message or update UI
        }, 1500);
      } else {
        const errorData = await response.json();
        setOtpError(errorData.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("An error occurred while verifying OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const filteredEvents = RecommendedEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCause =
      causeFilter === "all" ||
      event.cause.toLowerCase() === causeFilter.toLowerCase();
    return matchesSearch && matchesCause;
  });

  const getevents=()=>{
    navigate("/events");
  };
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "Very High":
        return "bg-purple-100 text-purple-800";
      case "High":
        return "bg-blue-100 text-blue-800";
      case "Medium":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  VolunteerConnect
                </span>
              </Link>
              <div className="ml-8">
                <Badge variant="secondary" className="px-3 py-1">
                  Student Dashboard
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" asChild onClick={()=>{localStorage.clear();
}}>
                <Link to="/login">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user.username}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to make a difference today?
              </p>
            </div>
            <Button onClick={getevents} >
              <Search className="h-4 w-4" />
                Browse All Events
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Events Participated
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.user_events}</div>
              <p className="text-xs text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Events Completed
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.completed_events}</div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Organizations Helped
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.organizations_helped}</div>
              <p className="text-xs text-muted-foreground">
                All different causes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Impact Level
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.impactLevel}</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Discover Events</CardTitle>
                <CardDescription>
                  Find volunteer opportunities that match your interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events or organizations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={causeFilter} onValueChange={setCauseFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by cause" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Causes</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="youth">Youth</SelectItem>
                      <SelectItem value="animals">Animals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Event Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {event.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span>{event.organization}</span>
                              <Badge variant="outline">{event.cause}</Badge>
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Badge
                              className={getDifficultyColor(event.difficulty)}
                              variant="secondary"
                            >
                              {event.difficulty}
                            </Badge>
                            <Badge
                              className={getImpactColor(event.impact)}
                              variant="secondary"
                            >
                              {event.impact}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {event.volunteersRegistered}/
                              {event.volunteersNeeded} registered
                            </span>
                          </div>
                        </div>

                        {event.skills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">
                              Preferred Skills:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {event.skills.map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4">
                          <Progress
                            value={
                              (event.volunteersRegistered /
                                event.volunteersNeeded) *
                              100
                            }
                            className="flex-1 mr-4"
                          />
                          <Button onClick={() => handleRegisterClick(event)}>
                            Register Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Events you're registered for
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {RegisteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.organization}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.date} • {event.time}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            event.status === "Confirmed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your volunteer history and impact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {RegisteredEvents && RegisteredEvents.filter(event => event.status === "Completed").length > 0 ? (
                    RegisteredEvents
                      .filter(event => event.status === "Completed")
                      .slice(0, 2)
                      .map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.organization}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {event.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {event.time}
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No completed events yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Track your volunteer journey and unlock new badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 border rounded-lg ${achievement.earned ? "bg-volunteer-50 border-volunteer-200" : "opacity-50"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                          {achievement.earned && (
                            <Badge variant="default" className="mt-2">
                              Earned!
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  See how close you are to your next achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Community Builder (25 hours needed)</span>
                    <span>47/25 hours</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Achievement unlocked! 🎉
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Teaching Star (3 workshops needed)</span>
                    <span>1/3 workshops</span>
                  </div>
                  <Progress value={33} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lead 2 more educational workshops to unlock
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your volunteer profile and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{user.username}</h3>
                      <p className="text-muted-foreground">{user.college}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Academic Year</p>
                      <p className="text-muted-foreground">{user.year}</p>
                    </div>
                    <div>
                      <p className="font-medium">Volunteer Since</p>
                      <p className="text-muted-foreground">{user.usersince}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Activites</p>
                      <p className="text-muted-foreground">
                        {userStats.user_events} events
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Interests</CardTitle>
                  <CardDescription>Your volunteer expertise</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {user.skills && user.skills.length > 0 ? (
                          user.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No skills added yet</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-sm mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {user.interests && user.interests.length > 0 ? (
                          user.interests.map((interest) => (
                            <Badge key={interest} variant="outline">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No interests added yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Registration Modal with OTP Verification */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription>
              Review event details and verify your registration
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6 py-4">
              {/* Event Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedEvent.cause}</Badge>
                  <Badge className={getDifficultyColor(selectedEvent.difficulty)}>
                    {selectedEvent.difficulty}
                  </Badge>
                  <Badge className={getImpactColor(selectedEvent.impact)}>
                    {selectedEvent.impact}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Organization</h4>
                  <p className="text-muted-foreground">{selectedEvent.organization}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Date
                    </h4>
                    <p className="text-muted-foreground">{selectedEvent.date}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time
                    </h4>
                    <p className="text-muted-foreground">{selectedEvent.time}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h4>
                  <p className="text-muted-foreground">{selectedEvent.location}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Volunteers
                  </h4>
                  <p className="text-muted-foreground">
                    {selectedEvent.volunteersRegistered} / {selectedEvent.volunteersNeeded} registered
                  </p>
                  <Progress
                    value={(selectedEvent.volunteersRegistered / selectedEvent.volunteersNeeded) * 100}
                    className="mt-2"
                  />
                </div>

                {selectedEvent.skills && selectedEvent.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* OTP Section */}
              <div className="border-t pt-6">
                {!otpSent ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>We'll send a verification code to {user.email}</span>
                    </div>
                    <Button
                      onClick={handleSendOtp}
                      disabled={isLoadingOtp}
                      className="w-full"
                    >
                      {isLoadingOtp ? "Sending OTP..." : "Send Verification Code"}
                    </Button>
                  </div>
                ) : !otpSuccess ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Enter Verification Code</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        We've sent a 6-digit code to {user.email}
                      </p>
                      
                      <div className="flex gap-2 justify-center">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-12 h-12 text-center text-lg font-semibold"
                          />
                        ))}
                      </div>

                      {otpError && (
                        <p className="text-sm text-red-500 mt-2 text-center">{otpError}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleSendOtp}
                        disabled={isLoadingOtp}
                        className="flex-1"
                      >
                        Resend Code{selectedEvent.id}
                      </Button>
                      <Button
                        onClick={() => handleVerifyOtp(selectedEvent.eventid)}
                        disabled={isVerifyingOtp || otp.join("").length !== 6}
                        className="flex-1"
                      >
                        {isVerifyingOtp ? "Verifying..." : "Verify & Register"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <h4 className="font-semibold text-lg">Registration Successful!</h4>
                    <p className="text-sm text-muted-foreground text-center">
                      You've been successfully registered for this event.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}