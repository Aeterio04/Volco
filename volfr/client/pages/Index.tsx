import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Calendar, Award, ArrowRight, Globe, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">VolunteerConnect</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                Browse Events
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-volunteer-50 to-volunteer-100 pt-16 pb-20 sm:pt-24 sm:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Connect <span className="text-primary">Volunteers</span> with{" "}
              <span className="text-primary">Purpose</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Bridge the gap between passionate volunteers and meaningful causes. 
              Join thousands of students making a difference in their communities through NGO partnerships.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link to="/register" className="flex items-center gap-2">
                  Join as Volunteer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/ngo-register" className="flex items-center gap-2">
                  Register NGO
                  <Handshake className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5,000+</div>
              <div className="text-sm text-gray-600 mt-1">Active Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">250+</div>
              <div className="text-sm text-gray-600 mt-1">Partner NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-gray-600 mt-1">Events Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How VolunteerConnect Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple steps to start making a difference in your community
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* For Students */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="w-12 h-12 bg-volunteer-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>For Students</CardTitle>
                <CardDescription>
                  Discover volunteering opportunities that match your interests and schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Browse events by cause and location
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Register for events instantly
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Track your volunteer hours
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Earn certificates and recognition
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* For NGOs */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="w-12 h-12 bg-volunteer-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>For NGOs</CardTitle>
                <CardDescription>
                  Reach passionate volunteers and organize impactful events easily
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Create and manage events
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Find skilled volunteers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Track participation and impact
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Build lasting partnerships
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Impact */}
            <Card className="relative overflow-hidden sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="w-12 h-12 bg-volunteer-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Measurable Impact</CardTitle>
                <CardDescription>
                  Track and celebrate the positive change you're making
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Real-time impact metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Community recognition
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Digital certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Portfolio building
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Causes */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Popular Causes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore volunteer opportunities across different impact areas
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "Education", count: 45, emoji: "📚" },
              { name: "Environment", count: 32, emoji: "🌱" },
              { name: "Health", count: 28, emoji: "❤️" },
              { name: "Community", count: 51, emoji: "🏘️" },
              { name: "Youth", count: 38, emoji: "👥" },
              { name: "Animals", count: 22, emoji: "🐾" },
            ].map((cause) => (
              <Card key={cause.name} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-2">{cause.emoji}</div>
                  <div className="font-medium text-foreground">{cause.name}</div>
                  <div className="text-sm text-muted-foreground">{cause.count} events</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to Make a Difference?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Join thousands of volunteers creating positive change in communities worldwide.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Join as Volunteer
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Browse Events
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">VolunteerConnect</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Connecting passionate volunteers with meaningful causes to create lasting positive impact in communities worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">For Volunteers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/events" className="hover:text-foreground transition-colors">Browse Events</Link></li>
                <li><Link to="/register" className="hover:text-foreground transition-colors">Sign Up</Link></li>
                <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">For NGOs</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/ngo-register" className="hover:text-foreground transition-colors">Partner With Us</Link></li>
                <li><Link to="/post-event" className="hover:text-foreground transition-colors">Post Event</Link></li>
                <li><Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 VolunteerConnect. All rights reserved. Built with ❤️ for better communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
