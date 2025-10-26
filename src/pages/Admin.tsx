import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, LogIn, LogOut, Loader2, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in_progress" | "resolved";
  address: string;
  image_url: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['admin', 'moderator'])
          .maybeSingle();
        
        const hasRole = !!roleData;
        setHasAdminRole(hasRole);
        
        if (!hasRole) {
          toast.error("Access Denied: You don't have admin permissions");
          await supabase.auth.signOut();
          setUser(null);
        }
      }
    } catch (error) {
      toast.error("Failed to verify permissions");
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Verify admin role after login
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .in('role', ['admin', 'moderator'])
        .maybeSingle();
      
      const hasRole = !!roleData;
      
      if (!hasRole) {
        toast.error("Access Denied: You don't have admin permissions");
        await supabase.auth.signOut();
        return;
      }
      
      setUser(data.user);
      setHasAdminRole(true);
      toast.success("Logged in successfully - Welcome to Admin Dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
  };

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error) {
      toast.error("Failed to load issues");
    }
  };

  const handleUpdateIssue = async () => {
    if (!selectedIssue) return;
    
    if (adminNotes.length > 5000) {
      toast.error("Admin notes must be less than 5000 characters");
      return;
    }
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("issues")
        .update({
          status: newStatus as any,
          admin_notes: adminNotes.trim(),
        })
        .eq("id", selectedIssue.id);

      if (error) throw error;

      toast.success("Issue updated successfully");
      setSelectedIssue(null);
      setNewStatus("");
      setAdminNotes("");
      fetchIssues();
    } catch (error: any) {
      toast.error("Failed to update issue");
    } finally {
      setUpdating(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !hasAdminRole) {
    return (
      <div className="min-h-screen gradient-dark">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="gradient-card shadow-card border-border">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <CardDescription>
                  Sign in to manage civic issues and update their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Portal</h1>
            <p className="text-muted-foreground">Manage and update civic issues</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issues List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold mb-4">All Issues</h2>
            {issues.map((issue) => (
              <Card
                key={issue.id}
                className={`gradient-card shadow-card border-border cursor-pointer transition-smooth ${
                  selectedIssue?.id === issue.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedIssue(issue);
                  setNewStatus(issue.status);
                  setAdminNotes(issue.admin_notes || "");
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{issue.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {issue.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        issue.status === "resolved"
                          ? "bg-success/20 text-success border-success"
                          : issue.status === "in_progress"
                          ? "bg-warning/20 text-warning border-warning"
                          : "bg-destructive/20 text-destructive border-destructive"
                      }
                    >
                      {issue.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Category:</span> {issue.category}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Location:</span> {issue.address}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Reported {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Update Panel */}
          <div className="lg:col-span-1">
            {selectedIssue ? (
              <Card className="gradient-card shadow-card border-border sticky top-24">
                <CardHeader>
                  <CardTitle>Update Issue</CardTitle>
                  <CardDescription>
                    Change the status and add notes for this issue
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedIssue.image_url && (
                    <img
                      src={selectedIssue.image_url}
                      alt={selectedIssue.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about actions taken..."
                      className="min-h-[120px]"
                      maxLength={5000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {adminNotes.length}/5000 characters
                    </p>
                  </div>

                  <Button
                    onClick={handleUpdateIssue}
                    className="w-full"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Update Issue
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="gradient-card shadow-card border-border">
                <CardContent className="py-16 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select an issue to update its status
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
