"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Send,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import * as ticketService from "@/services/ticketService";
import * as ticketCommentService from "@/services/ticketCommentService";
import {
  TicketCommentDto,
  TicketDto,
  TicketPriority,
  TicketStatus,
} from "@/types/crm-types";

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const resolvedParams = use(params);
  const ticketId = Number(resolvedParams.id);

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [ticket, setTicket] = useState<TicketDto | null>(null);
  const [comments, setComments] = useState<TicketCommentDto[]>([]);
  const [newComment, setNewComment] = useState("");

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && ticketId) {
      setIsDataLoading(true);
      setError(null);

      Promise.all([
        ticketService.getTicketById(ticketId),
        ticketCommentService.getCommentsByTicket(ticketId),
      ])
        .then(([ticketResponse, commentsResponse]) => {
          setTicket(ticketResponse.data);
          setComments(commentsResponse.data);
        })
        .catch((err) => {
          console.error("Bilet verileri yüklenirken hata:", err);
          setError("Bilet veya yorum verileri yüklenemedi.");
        })
        .finally(() => {
          setIsDataLoading(false);
        });
    }
  }, [ticketId, isAuthenticated, isAuthLoading, router]);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (ticket) {
      const oldTicket = ticket;
      setTicket({ ...ticket, status: newStatus });

      try {
        const response = await ticketService.updateTicketStatus(
          ticket.id,
          newStatus
        );
        setTicket(response.data);
      } catch (err) {
        console.error("Durum güncellenirken hata:", err);
        setError("Durum güncellenemedi.");
        setTicket(oldTicket);
      }
    }
  };

  const handlePriorityChange = async (newPriority: TicketPriority) => {
    if (ticket) {
      const oldTicket = ticket;
      setTicket({ ...ticket, priority: newPriority });

      try {
        const updatedData = { ...ticket, priority: newPriority };
        const response = await ticketService.updateTicket(
          ticket.id,
          updatedData
        );
        setTicket(response.data);
      } catch (err) {
        console.error("Öncelik güncellenirken hata:", err);
        setError("Öncelik güncellenemedi.");
        setTicket(oldTicket);
      }
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user || !ticket) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const commentDto = {
        ticketId: ticket.id,
        comment: newComment,
      };

      const response = await ticketCommentService.addComment(commentDto);

      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err) {
      console.error("Yorum gönderilirken hata:", err);
      setError("Yorum gönderilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "RESOLVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "MEDIUM":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "LOW":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("tr-TR", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isDataLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
               {" "}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             {" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center bg-red-100 text-red-700">
          <p>{error}</p>
          <Link href="/dashboard">
            <Button variant="link" className="mt-4">
              Back to Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!ticket || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Ticket not found or user not authenticated.
          </p>
          <Link href="/dashboard">
            <Button variant="link" className="mt-4">
              Back to Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const customer = ticket.customer;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />         
                      Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-muted-foreground">
                  #{ticket.id}
                </span>
                <h1 className="text-lg font-semibold text-foreground text-balance">
                  {ticket.subject}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3" />           
                        Created {formatDateTime(ticket.createdAt)}             
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed">
                  {ticket.description}
                </p>
              </div>
            </Card>
            <Card className="p-6">
                           {" "}
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Comments
              </h2>
              <div className="space-y-4 mb-6">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No comments yet. Be the first to respond!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-lg ${
                        comment.authorRole === "AGENT"
                          ? "bg-primary/5 border border-primary/20"
                          : "bg-muted border border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              comment.authorRole === "AGENT"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted-foreground text-background"
                            }`}
                          >
                            <User className="w-4 h-4" />                       
                          </div>
                          <div>
                            <div className="font-medium text-sm text-foreground">
                              {comment.authorFirstName} {comment.authorLastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {comment.authorRole === "AGENT"
                                ? "Support Agent"
                                : "Customer"}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {comment.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your response..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                  >
                                        <Send className="w-4 h-4 mr-2" />       
                                {isSubmitting ? "Sending..." : "Send Reply"}   
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">
                Ticket Actions
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Status
                  </label>
                  <Select
                    value={ticket.status}
                    onValueChange={(value) =>
                      handleStatusChange(value as TicketStatus)
                    }
                  >
                    <SelectTrigger>
                                            <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>               
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem> 
                      <SelectItem value="RESOLVED">Resolved</SelectItem>       
                      <SelectItem value="CLOSED">Closed</SelectItem>           
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Priority
                  </label>
                  <Select
                    value={ticket.priority}
                    onValueChange={(value) =>
                      handlePriorityChange(value as TicketPriority)
                    }
                  >
                    <SelectTrigger>
                                            <SelectValue />               
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>                 
                          <SelectItem value="MEDIUM">Medium</SelectItem>       
                                    <SelectItem value="HIGH">High</SelectItem> 
                      <SelectItem value="URGENT">Urgent</SelectItem>           
                    </SelectContent>
                  </Select>
                </div>
                {ticket.assignedAgent && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Assigned to</span>
                      <span className="font-medium text-foreground">
                        {ticket.assignedAgent.firstName}
                        {ticket.assignedAgent.lastName}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />     
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">Customer</p>   
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />     
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground break-all">
                      {customer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />   
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{customer.phone}</p> 
                  </div>
                </div>
                <Link href="/customers">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                             View Customer Profile
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
