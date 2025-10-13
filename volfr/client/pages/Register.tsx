import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Mail, Lock, User, GraduationCap, Building, ArrowRight, Users, Globe } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const volunteerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  contact: z.string().min(2, "Contact is required"),
  major: z.string().min(2, "Major/field of study is required"),
  location: z.string().min(1, "Please select your nearest Location"),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  year: z.string().min(1, "Please select your academic year"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ngoSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  contactPerson: z.string().min(2, "Contact person name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  address: z.string().min(10, "Full address is required"),
  description: z.string().min(50, "Organization description must be at least 50 characters"),
  focusAreas: z.string().min(10, "Please describe your focus areas"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type VolunteerForm = z.infer<typeof volunteerSchema>;
type NGOForm = z.infer<typeof ngoSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("volunteer");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get("tab");
    if (tab === "ngo") {
      setActiveTab("ngo");
    }
  }, [location.search]);

  const volunteerForm = useForm<VolunteerForm>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      contact: "",
      major: "",
      location: "",
      interests: [""],
      skills: [""],
      year: "",
    },
  });

  const ngoForm = useForm<NGOForm>({
    resolver: zodResolver(ngoSchema),
    defaultValues: {
      organizationName: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactPerson: "",
      phone: "",
      website: "",
      address: "",
      description: "",
      focusAreas: "",
    },
  });

  const onVolunteerSubmit = async (data: VolunteerForm) => {
    setIsLoading(true);
    try {
      console.log("Volunteer registration data:", data);

      // Get CSRF token (from Django cookie)
      const csrftoken = Cookies.get("csrftoken");
      console.log("CSRF Token:", csrftoken);
      // Send data using fetch
      const response = await fetch("http://127.0.0.1:8000/api/volunteer/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken || "",
        },
        credentials: "include", // sends cookies (important for CSRF)
        body: JSON.stringify(data),
      });

      console.log("Server response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Server Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onNGOSubmit = async (data: NGOForm) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual registration logic
      console.log("NGO registration data:", data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      navigate("/ngo-dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-volunteer-50 to-volunteer-100">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">VolunteerConnect</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Already have an account?</span>
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Registration Form */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join VolunteerConnect</CardTitle>
            <CardDescription>
              Create your account to start making a difference in your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="volunteer" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Student Volunteer
                </TabsTrigger>
                <TabsTrigger value="ngo" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  NGO Partner
                </TabsTrigger>
              </TabsList>

              <TabsContent value="volunteer" className="space-y-4 mt-6">
                <div className="text-center mb-6">
                  <GraduationCap className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Student Volunteer Registration</h3>
                  <p className="text-sm text-muted-foreground">Join as a student volunteer to discover meaningful opportunities</p>
                </div>

                <Form {...volunteerForm}>
                  <form onSubmit={volunteerForm.handleSubmit(onVolunteerSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={volunteerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="John Doe" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={volunteerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="john@university.edu" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={volunteerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="Create password" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={volunteerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="Confirm password" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={volunteerForm.control}
                        name="contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact</FormLabel>
                            <FormControl>
                              <Input placeholder="Contact Info" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={volunteerForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Your nearest Location" />
                                </SelectTrigger>
                              </FormControl>
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
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                      control={volunteerForm.control}
                      name="major"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Major/Field of Study</FormLabel>
                          <FormControl>
                            <Input placeholder="Computer Science, Biology, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                        control={volunteerForm.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Year</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Your Academic Year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Freshman">Freshman</SelectItem>
                                <SelectItem value="Sophomore">Sophomore</SelectItem>
                                <SelectItem value="Junior">Junior</SelectItem>
                                <SelectItem value="Senior">Senior</SelectItem>
                               
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>
                    

                    <FormField
                      control={volunteerForm.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volunteer Interests</FormLabel>
                          <FormDescription>
                            Select all areas you're interested in volunteering
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
                      control={volunteerForm.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Skills</FormLabel>
                          <FormDescription>
                            Select all skills you can contribute as a volunteer
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

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        "Creating Account..."
                      ) : (
                        <>
                          Create Volunteer Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="ngo" className="space-y-4 mt-6">
                <div className="text-center mb-6">
                  <Building className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">NGO Partner Registration</h3>
                  <p className="text-sm text-muted-foreground">Register your organization to connect with passionate volunteers</p>
                </div>

                <Form {...ngoForm}>
                  <form onSubmit={ngoForm.handleSubmit(onNGOSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={ngoForm.control}
                        name="organizationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Green Earth Initiative" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ngoForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="contact@organization.org" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={ngoForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="Create password" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ngoForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="Confirm password" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={ngoForm.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Jane Smith" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ngoForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={ngoForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.organization.org" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={ngoForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="123 Main Street, City, State, ZIP Code"
                              className="min-h-16"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={ngoForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your organization's mission, values, and what you do..."
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will be displayed to volunteers browsing events
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={ngoForm.control}
                      name="focusAreas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Focus Areas</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Environment, Education, Health, Community Development, etc."
                              className="min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            List the main causes and areas your organization focuses on
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        "Creating Account..."
                      ) : (
                        <>
                          Create NGO Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
