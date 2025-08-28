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
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { format } from "date-fns";

const eventSchema = z.object({
  title: z.string().min(5, "Event title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  cause: z.string().min(1, "Please select a cause"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  date: z.date({
    required_error: "Please select a date for the event",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  volunteersNeeded: z
    .string()
    .min(1, "Number of volunteers needed is required"),
  skills: z.string().optional(),
  requirements: z.string().optional(),
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

  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      cause: "",
      location: "",
      startTime: "",
      endTime: "",
      volunteersNeeded: "",
      skills: "",
      requirements: "",
    },
  });

  const onSubmit = async (data: EventForm) => {
    try {
      console.log("Event data:", data);
      setIsCreateEventOpen(false);
      form.reset();
      // TODO: Implement actual event creation
    } catch (error) {
      console.error("Error creating event:", error);
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
                  NGO Dashboard
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
                Green Earth Initiative
              </h1>
              <p className="text-muted-foreground mt-1">
                Environmental conservation and community education
              </p>
            </div>
            <Dialog
              open={isCreateEventOpen}
              onOpenChange={setIsCreateEventOpen}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cause"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cause Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select cause" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="environment">
                                  Environment
                                </SelectItem>
                                <SelectItem value="education">
                                  Education
                                </SelectItem>
                                <SelectItem value="health">Health</SelectItem>
                                <SelectItem value="community">
                                  Community
                                </SelectItem>
                                <SelectItem value="youth">Youth</SelectItem>
                                <SelectItem value="animals">Animals</SelectItem>
                              </SelectContent>
                            </Select>
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

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() ||
                                    date < new Date("1900-01-01")
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
                          <FormLabel>Preferred Skills (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Gardening, Teaching, Physical Labor, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            List any specific skills that would be helpful for
                            this event
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirements (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any age restrictions, physical requirements, or items volunteers should bring..."
                              className="min-h-20"
                              {...field}
                            />
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
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Volunteers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+18 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Hours Contributed
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+89 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Impact Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">+5% improvement</p>
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
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Your next scheduled volunteer events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.date} • {event.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            event.status === "Published"
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
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Volunteer Activity</CardTitle>
                  <CardDescription>
                    Latest volunteer registrations and activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockVolunteers.map((volunteer) => (
                    <div
                      key={volunteer.id}
                      className="flex items-center space-x-3"
                    >
                      <Avatar>
                        <AvatarFallback>
                          {volunteer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{volunteer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {volunteer.university}
                        </p>
                      </div>
                      <Badge variant="outline">New</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
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
                    {mockEvents.map((event) => (
                      <TableRow key={event.id}>
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
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Database</CardTitle>
                <CardDescription>
                  Manage your registered volunteers and their information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Events Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVolunteers.map((volunteer) => (
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
                        <TableCell>{volunteer.university}</TableCell>
                        <TableCell>{volunteer.skills}</TableCell>
                        <TableCell>
                          <Badge variant="outline">3 events</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
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
                      <span>Average volunteers per event</span>
                      <span className="font-bold">12.5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Volunteer retention rate</span>
                      <span className="font-bold">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Event completion rate</span>
                      <span className="font-bold">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Metrics</CardTitle>
                  <CardDescription>
                    Measure your organization's community impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total volunteer hours</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Community members served</span>
                      <span className="font-bold">2,350</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Environmental impact score</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">A+</span>
                        <Award className="h-4 w-4 text-primary" />
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
