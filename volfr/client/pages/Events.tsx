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
  Calendar as CalendarIcon,
  Users,
  Clock,
  MapPin,
  Filter,
  SlidersHorizontal,
  Star,
  Building2,
  ChevronDown,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

// Mock data for demonstration
const mockEvents = [
  {
    id: 1,
    title: "Community Garden Cleanup",
    organization: "Green Earth Initiative",
    organizationLogo: "🌱",
    cause: "Environment",
    date: "2024-02-15",
    time: "9:00 AM - 1:00 PM",
    location: "Aga Khan Palace Community Garden",
    city: "Kalyani Nagar",
    volunteersNeeded: 15,
    volunteersRegistered: 12,
    description:
      "Help clean and maintain our community garden. We'll be removing weeds, planting new vegetables, and organizing the tool shed. Perfect for those who love being outdoors and making a tangible impact on their community. No gardening experience required - we'll provide training and all necessary tools!",
    skills: ["Gardening", "Physical Labor", "Organization"],
    difficulty: "Easy",
    impact: "High",
    featured: true,
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    title: "Youth Coding Workshop",
    organization: "Tech for All",
    organizationLogo: "💻",
    cause: "Education",
    date: "2024-02-20",
    time: "2:00 PM - 5:00 PM",
    location: "Rajiv Gandhi IT Park",
    city: "Hinjewadi",
    volunteersNeeded: 8,
    volunteersRegistered: 6,
    description:
      "Teach basic programming concepts to underprivileged youth aged 12-16. Help bridge the digital divide by sharing your coding knowledge. We'll cover HTML, CSS, and basic JavaScript through fun, interactive projects. Looking for volunteers with programming experience and patience for teaching.",
    skills: ["Programming", "Teaching", "Patience"],
    difficulty: "Medium",
    impact: "Very High",
    featured: false,
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 3,
    title: "Food Bank Distribution",
    organization: "Community Care Network",
    organizationLogo: "🍞",
    cause: "Community",
    date: "2024-02-25",
    time: "8:00 AM - 12:00 PM",
    location: "Shaniwar Peth Community Center",
    city: "Shaniwar Peth",
    volunteersNeeded: 20,
    volunteersRegistered: 18,
    description:
      "Sort and distribute food packages to families in need. Join our weekly food distribution program that serves over 200 families in our community. Tasks include sorting donations, packing family-sized meals, and helping with distribution. Great for groups and first-time volunteers.",
    skills: ["Organization", "Communication", "Physical Labor"],
    difficulty: "Easy",
    impact: "High",
    featured: true,
    rating: 4.7,
    reviews: 42,
  },
  {
    id: 4,
    title: "Senior Center Bingo Night",
    organization: "Elder Care Foundation",
    organizationLogo: "👴",
    cause: "Community",
    date: "2024-02-28",
    time: "6:00 PM - 9:00 PM",
    location: "Koregaon Park Senior Center",
    city: "Koregaon Park",
    volunteersNeeded: 6,
    volunteersRegistered: 4,
    description:
      "Bring joy to senior residents through an evening of bingo and social interaction. Help set up the game, call numbers, assist residents, and provide companionship. This is a wonderful opportunity to connect with older adults and learn from their life experiences.",
    skills: ["Communication", "Patience", "Social Skills"],
    difficulty: "Easy",
    impact: "Medium",
    featured: false,
    rating: 4.6,
    reviews: 15,
  },
  {
    id: 5,
    title: "Lake Cleanup Initiative",
    organization: "Ocean Conservation Society",
    organizationLogo: "🌊",
    cause: "Environment",
    date: "2024-03-05",
    time: "7:00 AM - 11:00 AM",
    location: "Pashan Lake",
    city: "Pashan",
    volunteersNeeded: 25,
    volunteersRegistered: 15,
    description:
      "Join our monthly lake cleanup to protect aquatic life and keep our beautiful Pashan Lake clean. We'll provide all cleanup materials, data collection sheets, and refreshments. Learn about water conservation while making a direct impact on the environment. Family-friendly event!",
    skills: ["Environmental Awareness", "Physical Labor"],
    difficulty: "Easy",
    impact: "High",
    featured: false,
    rating: 4.9,
    reviews: 33,
  },
  {
    id: 6,
    title: "Animal Shelter Care",
    organization: "Paws & Hearts Rescue",
    organizationLogo: "🐕",
    cause: "Animals",
    date: "2024-03-08",
    time: "10:00 AM - 2:00 PM",
    location: "Pune Animal Welfare Society",
    city: "Sadashiv Peth",
    volunteersNeeded: 12,
    volunteersRegistered: 8,
    description:
      "Help care for rescued animals by cleaning kennels, feeding pets, and providing socialization. Great opportunity for animal lovers to make a difference in the lives of abandoned pets. Training provided for all tasks. Must be comfortable around dogs and cats.",
    skills: ["Animal Care", "Physical Labor", "Compassion"],
    difficulty: "Medium",
    impact: "High",
    featured: false,
    rating: 4.8,
    reviews: 27,
  },
];

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
const timeCommitments = ["All", "2-4 hours", "4-6 hours", "6+ hours"];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCause, setSelectedCause] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedTimeCommitment, setSelectedTimeCommitment] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("date");

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = mockEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
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
          return b.volunteersRegistered - a.volunteersRegistered;
        case "rating":
          return b.rating - a.rating;
        case "impact":
          const impactOrder = { "Very High": 4, High: 3, Medium: 2, Low: 1 };
          return (
            impactOrder[b.impact as keyof typeof impactOrder] -
            impactOrder[a.impact as keyof typeof impactOrder]
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    searchQuery,
    selectedCause,
    selectedCity,
    selectedDifficulty,
    showFeaturedOnly,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCause("All");
    setSelectedCity("All");
    setSelectedDifficulty("All");
    setSelectedTimeCommitment("All");
    setShowFeaturedOnly(false);
  };

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
            </div>
            <div className="hidden md:flex items-center space-x-8">
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
            {filteredAndSortedEvents.length} events available.
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
                    />
                  </div>
                </div>

                {/* Cause Filter */}
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

                {/* Location Filter */}
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
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
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter Events</SheetTitle>
                    <SheetDescription>
                      Refine your search to find the perfect volunteer
                      opportunity
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Mobile filters - same as desktop but in sheet */}
                    <div>
                      <Label
                        htmlFor="mobile-search"
                        className="text-sm font-medium"
                      >
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
                <Label className="text-sm text-muted-foreground">
                  Sort by:
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
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

            {/* Events Grid */}
            <div className="space-y-6">
              {filteredAndSortedEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No events found
                    </h3>
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
                                    {event.organizationLogo}
                                  </span>
                                  <span>{event.organization}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{event.rating}</span>
                                  <span>({event.reviews})</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline">{event.cause}</Badge>
                                <Badge
                                  className={getDifficultyColor(
                                    event.difficulty,
                                  )}
                                  variant="secondary"
                                >
                                  {event.difficulty}
                                </Badge>
                                <Badge
                                  className={getImpactColor(event.impact)}
                                  variant="secondary"
                                >
                                  {event.impact} Impact
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {event.description}
                          </p>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
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
                              <span>{event.city}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {event.volunteersRegistered}/
                                {event.volunteersNeeded} spots
                              </span>
                            </div>
                          </div>

                          {event.skills.length > 0 && (
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
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">
                                {Math.round(
                                  (event.volunteersRegistered /
                                    event.volunteersNeeded) *
                                    100,
                                )}
                                %
                              </p>
                              <p className="text-xs text-muted-foreground">
                                filled
                              </p>
                            </div>

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

                          <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-muted-foreground text-center">
                              {event.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Load More Button */}
            {filteredAndSortedEvents.length > 0 && (
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
