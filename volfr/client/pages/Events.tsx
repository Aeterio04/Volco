import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Heart,
  Search,
  Calendar,
  Users,
  Clock,
  MapPin,
  Filter,
  SlidersHorizontal,
  Star,
  Building2,
  ChevronDown,
  X,
  Loader2,
  ArrowLeft,
  Settings,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

const causes = [
  "All",
  "Environment",
  "Education",
  "Health",
  "Community",
  "Youth",
  "Animals",
];
const cities = [
  "All",
  "Kalyani Nagar",
  "Hinjewadi",
  "Shaniwar Peth",
  "Koregaon Park",
  "Pashan",
  "Sadashiv Peth",
];
const difficulties = ["All", "Easy", "Medium", "Hard"];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCause, setSelectedCause] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  // Fetch events on component mount
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    setUserType(user);

    async function loadEvents() {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setError("No access token found. Please log in.");
          setLoading(false);
          return;
        }

        // Build query parameters
        const params = new URLSearchParams();
        if (selectedCause !== "All") params.append("cause", selectedCause);
        if (selectedCity !== "All") params.append("city", selectedCity);
        if (selectedDifficulty !== "All") params.append("difficulty", selectedDifficulty);
        if (searchQuery) params.append("search", searchQuery);

        const res = await fetch(`http://localhost:8000/api/user/filter-events/?${params.toString()}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched events:", data);
        
        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [selectedCause, selectedCity, selectedDifficulty, searchQuery]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCause("All");
    setSelectedCity("All");
    setSelectedDifficulty("All");
    setShowFeaturedOnly(false);
  };

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesSearch =
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCause =
        selectedCause === "All" || event.cause === selectedCause;
      const matchesCity = selectedCity === "All" || event.city === selectedCity;
      const matchesDifficulty =
        selectedDifficulty === "All" || event.difficulty === selectedDifficulty;
      const matchesFeatured = !showFeaturedOnly || event.featured;

      return (
        matchesSearch &&
        matchesCause &&
        matchesCity &&
        matchesDifficulty &&
        matchesFeatured
      );
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "popularity":
          return (b.volunteersRegistered || 0) - (a.volunteersRegistered || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "impact":
          const impactOrder = { "Very High": 4, High: 3, Medium: 2, Low: 1 };
          return (
            (impactOrder[b.impact] || 0) - (impactOrder[a.impact] || 0)
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    events,
    searchQuery,
    selectedCause,
    selectedCity,
    selectedDifficulty,
    showFeaturedOnly,
    sortBy,
  ]);

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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(isLoggedIn ? (userType === 'ngo' ? '/ngo-dashboard' : '/student-dashboard') : '/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  VolunteerConnect
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {isLoggedIn ? (
                <>
                  <Link
                    to={userType === 'ngo' ? '/ngo-dashboard' : '/student-dashboard'}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                  }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    to="/login"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Login
                  </Link>
                  <Button asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Volunteer Events
          </h1>
          <p className="text-muted-foreground">
            Discover meaningful volunteer opportunities in your community.{" "}
            {loading ? "Loading..." : `${filteredAndSortedEvents.length} events available.`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
                <CardDescription>
                  Refine your search to find the perfect volunteer opportunity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search" className="text-sm font-medium">
                    Search
                  </Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search events or organizations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Cause Filter */}
                <div>
                  <Label className="text-sm font-medium">Cause</Label>
                  <Select
                    value={selectedCause}
                    onValueChange={setSelectedCause}
                    disabled={loading}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {causes.map((cause) => (
                        <SelectItem key={cause} value={cause}>
                          {cause}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <Select 
                    value={selectedCity} 
                    onValueChange={setSelectedCity}
                    disabled={loading}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <Label className="text-sm font-medium">Difficulty</Label>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={setSelectedDifficulty}
                    disabled={loading}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={showFeaturedOnly}
                    onCheckedChange={(checked) =>
                      setShowFeaturedOnly(checked === true)
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Featured events only
                  </Label>
                </div>

                <Separator />

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button and Sort */}
            <div className="flex justify-between items-center mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden" disabled={loading}>
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter Events</SheetTitle>
                    <SheetDescription>
                      Refine your search to find the perfect volunteer opportunity
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <Label htmlFor="mobile-search" className="text-sm font-medium">
                        Search
                      </Label>
                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="mobile-search"
                          placeholder="Search events..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Cause</Label>
                      <Select
                        value={selectedCause}
                        onValueChange={setSelectedCause}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {causes.map((cause) => (
                            <SelectItem key={cause} value={cause}>
                              {cause}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <Select
                        value={selectedCity}
                        onValueChange={setSelectedCity}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mobile-featured"
                        checked={showFeaturedOnly}
                        onCheckedChange={(checked) =>
                          setShowFeaturedOnly(checked === true)
                        }
                      />
                      <Label htmlFor="mobile-featured" className="text-sm">
                        Featured only
                      </Label>
                    </div>

                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center space-x-2">
                <Label className="text-sm text-muted-foreground">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy} disabled={loading}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="impact">Impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <h3 className="text-lg font-medium mb-2">Loading events...</h3>
                  <p className="text-muted-foreground text-center">
                    Please wait while we fetch the latest volunteer opportunities.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && !loading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <X className="h-12 w-12 text-destructive mb-4" />
                  <h3 className="text-lg font-medium mb-2">Error loading events</h3>
                  <p className="text-muted-foreground text-center mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Events Grid */}
            {!loading && !error && (
              <div className="space-y-6">
                {filteredAndSortedEvents.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Search className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No events found</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Try adjusting your search criteria or clearing the filters
                        to see more events.
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAndSortedEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Event Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-xl font-semibold">
                                    {event.title}
                                  </h3>
                                  {event.featured && (
                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-lg">
                                      {event.organizationLogo || "🏢"}
                                    </span>
                                    <span>{event.organization}</span>
                                  </div>
                                  {event.rating && (
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span>{event.rating}</span>
                                      <span>({event.reviews || 0})</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {event.cause && (
                                    <Badge variant="outline">{event.cause}</Badge>
                                  )}
                                  {event.difficulty && (
                                    <Badge
                                      className={getDifficultyColor(event.difficulty)}
                                      variant="secondary"
                                    >
                                      {event.difficulty}
                                    </Badge>
                                  )}
                                  {event.impact && (
                                    <Badge
                                      className={getImpactColor(event.impact)}
                                      variant="secondary"
                                    >
                                      {event.impact} Impact
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {event.description}
                            </p>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                              {event.date && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.date}</span>
                                </div>
                              )}
                              {event.time && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.time}</span>
                                </div>
                              )}
                              {event.city && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.city}</span>
                                </div>
                              )}
                              {event.volunteersNeeded && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {event.volunteersRegistered || 0}/
                                    {event.volunteersNeeded} spots
                                  </span>
                                </div>
                              )}
                            </div>

                            {event.skills && event.skills.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium mb-2">
                                  Skills involved:
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
                          </div>

                          {/* Action Section */}
                          <div className="lg:w-48 flex flex-col justify-between">
                            <div className="space-y-3">
                              {event.volunteersNeeded && (
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-primary">
                                    {Math.round(
                                      ((event.volunteersRegistered || 0) /
                                        event.volunteersNeeded) *
                                      100
                                    )}
                                    %
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    filled
                                  </p>
                                </div>
                              )}

                              <div className="space-y-2">
                                <Button className="w-full">Register Now</Button>
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  size="sm"
                                >
                                  Learn More
                                </Button>
                              </div>
                            </div>

                            {event.location && (
                              <div className="mt-4 pt-4 border-t">
                                <p className="text-xs text-muted-foreground text-center">
                                  {event.location}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Load More Button */}
            {!loading && !error && filteredAndSortedEvents.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" className="px-8">
                  Load More Events
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}