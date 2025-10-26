import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
const Hero = () => {
  const scrollToReport = () => {
    document.getElementById("report-section")?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <section className="relative min-h-[500px] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{
      backgroundImage: `url(${heroBackground})`
    }}>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Report Issues.
            <br />
            
            <br />
            Build Better Cities.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Your voice matters. Report civic issues in your neighborhood and track their resolution 
            in real-time. Together, we create transparent, responsive communities.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <Button size="lg" className="shadow-glow" onClick={scrollToReport}>
              Report an Issue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#how-it-works">Learn More</a>
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-muted-foreground">No signup required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-muted-foreground">Real-time tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-muted-foreground">Full transparency</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;