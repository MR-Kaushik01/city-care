import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import IssueCard from "@/components/IssueCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in_progress" | "resolved";
  address: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [searchQuery, statusFilter, categoryFilter, issues]);

  const fetchIssues = async () => {
    try {
      // Use public view to exclude admin_notes from public access
      const { data, error } = await supabase
        .from("issues_public")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast.error("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    if (searchQuery) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((issue) => issue.category === categoryFilter);
    }

    setFilteredIssues(filtered);
  };

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    inProgress: issues.filter((i) => i.status === "in_progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="min-h-screen gradient-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Issues Dashboard</h1>
          <p className="text-muted-foreground">Track and monitor civic issues in your community</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="gradient-card shadow-card p-6 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Issues</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="gradient-card shadow-card p-6 border border-destructive/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-3xl font-bold text-destructive">{stats.pending}</p>
          </div>
          <div className="gradient-card shadow-card p-6 border border-warning/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">In Progress</p>
            <p className="text-3xl font-bold text-warning">{stats.inProgress}</p>
          </div>
          <div className="gradient-card shadow-card p-6 border border-success/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Resolved</p>
            <p className="text-3xl font-bold text-success">{stats.resolved}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="gradient-card shadow-card p-6 border border-border rounded-lg mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="garbage">Garbage/Waste</SelectItem>
                <SelectItem value="streetlight">Streetlight</SelectItem>
                <SelectItem value="drainage">Drainage</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(searchQuery || statusFilter !== "all" || categoryFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Issues Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No issues found matching your filters</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
