"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  mockTickets,
  mockComments,
  mockCustomers,
  type Ticket,
  type TicketComment,
  type Customer,
  type Agent,
  type TicketStatus,
  type TicketPriority,
} from "@/lib/mock-data"
import { ArrowLeft, User, Mail, Phone, Building2, Calendar, Send, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [comments, setComments] = useState<TicketComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const agentData = localStorage.getItem("agent")
    if (!agentData) {
      router.push("/login")
      return
    }
    setAgent(JSON.parse(agentData))

    // Load ticket data
    const ticketId = Number.parseInt(resolvedParams.id)
    const foundTicket = mockTickets.find((t) => t.id === ticketId)
    if (foundTicket) {
      setTicket(foundTicket)
      const foundCustomer = mockCustomers.find((c) => c.id === foundTicket.customerId)
      setCustomer(foundCustomer || null)
      const ticketComments = mockComments.filter((c) => c.ticketId === ticketId)
      setComments(ticketComments)
    }
  }, [resolvedParams.id, router])

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (ticket) {
      setTicket({ ...ticket, status: newStatus })
    }
  }

  const handlePriorityChange = (newPriority: TicketPriority) => {
    if (ticket) {
      setTicket({ ...ticket, priority: newPriority })
    }
  }

  const handleSubmitComment = () => {
    if (!newComment.trim() || !agent || !ticket) return

    setIsSubmitting(true)
    const comment: TicketComment = {
      id: comments.length + 1,
      ticketId: ticket.id,
      authorId: agent.id,
      authorName: agent.name,
      authorType: "agent",
      content: newComment,
      createdAt: new Date().toISOString(),
    }

    setComments([...comments, comment])
    setNewComment("")
    setIsSubmitting(false)
  }

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  if (!agent || !ticket || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
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
                <span className="text-sm font-mono text-muted-foreground">#{ticket.id}</span>
                <h1 className="text-lg font-semibold text-foreground text-balance">{ticket.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                  <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("-", " ")}</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Created {formatDateTime(ticket.createdAt)}
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed">{ticket.description}</p>
              </div>
            </Card>

            {/* Comments Thread */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Comments</h2>
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
                        comment.authorType === "agent"
                          ? "bg-primary/5 border border-primary/20"
                          : "bg-muted border border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              comment.authorType === "agent"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted-foreground text-background"
                            }`}
                          >
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-foreground">{comment.authorName}</div>
                            <div className="text-xs text-muted-foreground">
                              {comment.authorType === "agent" ? "Support Agent" : "Customer"}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDateTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your response..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmitComment} disabled={!newComment.trim() || isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Actions */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Ticket Actions</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                  <Select value={ticket.status} onValueChange={(value) => handleStatusChange(value as TicketStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
                  <Select
                    value={ticket.priority}
                    onValueChange={(value) => handlePriorityChange(value as TicketPriority)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {ticket.assignedAgentName && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Assigned to</span>
                      <span className="font-medium text-foreground">{ticket.assignedAgentName}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Customer Info */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">Customer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground break-all">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{customer.company}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Tickets</span>
                    <span className="font-medium text-foreground">{customer.totalTickets}</span>
                  </div>
                </div>
                <Link href="/customers">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Customer Profile
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
