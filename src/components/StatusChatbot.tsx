import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MessageCircle, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IssueStatus {
  display_id: string;
  title: string;
  status: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
  image_url: string | null;
}

const StatusChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [issueId, setIssueId] = useState("");
  const [searching, setSearching] = useState(false);
  const [issueData, setIssueData] = useState<IssueStatus | null>(null);

  const handleSearch = async () => {
    if (!issueId.trim()) {
      toast.error("Please enter a complaint ID");
      return;
    }

    setSearching(true);
    setIssueData(null);

    try {
      const { data, error } = await supabase
        .from("issues_public")
        .select("*")
        .eq("display_id", issueId.toUpperCase())
        .single();

      if (error || !data) {
        toast.error("Issue not found. Please check your ID and try again.");
        return;
      }

      setIssueData(data as IssueStatus);
      toast.success("Issue found!");
    } catch (error) {
      toast.error("Failed to fetch issue status. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "in_progress":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").toUpperCase();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 shadow-2xl z-50 max-h-[600px] overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Check Status
            </CardTitle>
            <CardDescription>
              Enter your complaint ID to check status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., ISSUE-123456"
                value={issueId}
                onChange={(e) => setIssueId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={searching} size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {issueData && (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{issueData.title}</h3>
                    <Badge className={getStatusColor(issueData.status)}>
                      {getStatusLabel(issueData.status)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p><strong>ID:</strong> {issueData.display_id}</p>
                    <p><strong>Category:</strong> {issueData.category}</p>
                    <p><strong>Reported:</strong> {new Date(issueData.created_at).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(issueData.updated_at).toLocaleDateString()}</p>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm"><strong>Description:</strong></p>
                    <p className="text-sm text-muted-foreground">{issueData.description}</p>
                  </div>

                  {issueData.image_url && (
                    <div className="pt-2">
                      <img
                        src={issueData.image_url}
                        alt="Issue"
                        className="w-full rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {!issueData && !searching && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Enter your complaint ID above to check the status of your reported issue.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default StatusChatbot;
