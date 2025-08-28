import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

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
    status: "Confirmed",
    hoursLogged: 4,
  },
  {
    id: 5,
    title: "Senior Center Visit",
    organization: "Elder Care Foundation",
    cause: "Community",
    date: "2024-02-18",
    time: "1:00 PM - 4:00 PM",
    location: "Koregaon Park Senior Center",
    status: "Confirmed",
    hoursLogged: 0,
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

  const filteredEvents = mockRecommendedEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCause =
      causeFilter === "all" ||
      event.cause.toLowerCase() === causeFilter.toLowerCase();
    return matchesSearch && matchesCause;
  });

  const getDifficultyColor = (difficulty: string) => {
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

  const getImpactColor = (impact: string) => {
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
              <Button variant="ghost" size="sm" asChild>
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
                Welcome back, Sarah!
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to make a difference today?
              </p>
            </div>
            <Button asChild>
              <Link to="/events" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse All Events
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Volunteer Hours
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
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
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 this month</p>
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
              <div className="text-2xl font-bold">5</div>
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
              <div className="text-2xl font-bold">Rising Star</div>
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
                          <Button>Register Now</Button>
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
                  {mockRegisteredEvents.map((event) => (
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
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Lake Cleanup Day</p>
                      <p className="text-sm text-muted-foreground">
                        Ocean Conservation Society
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Feb 10, 2024
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        Completed
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        4 hours logged
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Library Reading Program</p>
                      <p className="text-sm text-muted-foreground">
                        City Library Foundation
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Feb 5, 2024
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        Completed
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        3 hours logged
                      </p>
                    </div>
                  </div>
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
                      <h3 className="text-lg font-medium">Sarah Johnson</h3>
                      <p className="text-muted-foreground">
                        Computer Science Major
                      </p>
                      <p className="text-muted-foreground">State University</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">
                        sarah@university.edu
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Academic Year</p>
                      <p className="text-muted-foreground">Junior</p>
                    </div>
                    <div>
                      <p className="font-medium">Volunteer Since</p>
                      <p className="text-muted-foreground">September 2023</p>
                    </div>
                    <div>
                      <p className="font-medium">Preferred Causes</p>
                      <p className="text-muted-foreground">
                        Education, Environment
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
                        <Badge variant="outline">Teaching</Badge>
                        <Badge variant="outline">Programming</Badge>
                        <Badge variant="outline">Communication</Badge>
                        <Badge variant="outline">Leadership</Badge>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-sm mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Education</Badge>
                        <Badge variant="outline">Environment</Badge>
                        <Badge variant="outline">Technology</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
