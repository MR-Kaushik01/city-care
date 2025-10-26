import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, LayoutDashboard, Shield } from "lucide-react";
import logo from "@/assets/civic-connect-logo.png";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 transition-smooth hover:opacity-80">
            <img src={logo} alt="City Care" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">City Care</h1>
              <p className="text-xs text-muted-foreground">Building Better Communities</p>
            </div>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <MapPin className="h-4 w-4 mr-2" />
                Report Issue
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/admin">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
