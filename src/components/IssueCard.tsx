import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

const statusConfig = {
  pending: { label: "Pending", className: "bg-destructive/20 text-destructive border-destructive" },
  in_progress: { label: "In Progress", className: "bg-warning/20 text-warning border-warning" },
  resolved: { label: "Resolved", className: "bg-success/20 text-success border-success" },
};

const categoryLabels: Record<string, string> = {
  pothole: "Pothole",
  garbage: "Garbage/Waste",
  streetlight: "Streetlight",
  drainage: "Drainage",
  other: "Other",
};

const IssueCard = ({ issue, onClick }: IssueCardProps) => {
  const statusInfo = statusConfig[issue.status];

  return (
    <Card
      className="gradient-card shadow-card border-border hover:border-primary/50 transition-smooth cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      {issue.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={issue.image_url}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}
      
      {!issue.image_url && (
        <div className="relative h-48 bg-muted flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-smooth">
            {issue.title}
          </h3>
          <Badge variant="outline" className={statusInfo.className}>
            {statusInfo.label}
          </Badge>
        </div>
        
        <Badge variant="secondary" className="w-fit">
          {categoryLabels[issue.category]}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{issue.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Reported {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;
