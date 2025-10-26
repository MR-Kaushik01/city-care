import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ReportIssueForm from "@/components/ReportIssueForm";
import StatusChatbot from "@/components/StatusChatbot";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Eye, CheckCircle2, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-dark">
      <Header />
      <Hero />
      
      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and effective civic engagement in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="gradient-card shadow-card border-border text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Report Issue</h3>
                <p className="text-muted-foreground">
                  Spot a problem? Take a photo, add location, and describe the issue. 
                  No signup required—just submit instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-card border-border text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Track Progress</h3>
                <p className="text-muted-foreground">
                  View all community issues on our dashboard. Track status updates in real-time 
                  as authorities work on solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-card border-border text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. See Results</h3>
                <p className="text-muted-foreground">
                  Transparent resolution tracking shows completed work. 
                  Together, we build better, safer communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Report Section */}
      <section id="report-section" className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <ReportIssueForm />
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <span className="text-primary text-sm font-semibold">Community Impact</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Building Better Communities Together</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your voice creates change. Every report helps make our neighborhoods safer and cleaner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">100%</h3>
              <p className="text-muted-foreground">Transparent Process</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-success/10 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-3xl font-bold mb-2">Real-time</h3>
              <p className="text-muted-foreground">Status Updates</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-3xl font-bold mb-2">Location</h3>
              <p className="text-muted-foreground">Based Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 City Care. Building better communities together.
          </p>
        </div>
      </footer>

      {/* Status Chatbot */}
      <StatusChatbot />
    </div>
  );
};

export default Index;
