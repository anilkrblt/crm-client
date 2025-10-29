export type TicketStatus = "open" | "in-progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "urgent"

export interface Agent {
  id: number
  name: string
  email: string
  role: string
}

export interface Customer {
  id: number
  name: string
  email: string
  company: string
  phone: string
  createdAt: string
  totalTickets: number
}

export interface TicketComment {
  id: number
  ticketId: number
  authorId: number
  authorName: string
  authorType: "agent" | "customer"
  content: string
  createdAt: string
}

export interface Ticket {
  id: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  customerId: number
  customerName: string
  assignedAgentId: number | null
  assignedAgentName: string | null
  createdAt: string
  updatedAt: string
}

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@techcorp.com",
    company: "TechCorp Inc.",
    phone: "+1 (555) 123-4567",
    createdAt: "2024-01-15T10:00:00Z",
    totalTickets: 12,
  },
  {
    id: 2,
    name: "Emily Chen",
    email: "emily.chen@innovate.io",
    company: "Innovate Solutions",
    phone: "+1 (555) 234-5678",
    createdAt: "2024-02-20T14:30:00Z",
    totalTickets: 8,
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    email: "michael.r@globaltech.com",
    company: "GlobalTech Systems",
    phone: "+1 (555) 345-6789",
    createdAt: "2024-03-10T09:15:00Z",
    totalTickets: 15,
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@dataflow.com",
    company: "DataFlow Analytics",
    phone: "+1 (555) 456-7890",
    createdAt: "2024-01-25T11:45:00Z",
    totalTickets: 6,
  },
]

export const mockTickets: Ticket[] = [
  {
    id: 1001,
    title: "Unable to access dashboard after login",
    description:
      "After successfully logging in, I get redirected to a blank page instead of the dashboard. This has been happening since yesterday.",
    status: "open",
    priority: "urgent",
    customerId: 1,
    customerName: "John Smith",
    assignedAgentId: null,
    assignedAgentName: null,
    createdAt: "2025-01-22T09:30:00Z",
    updatedAt: "2025-01-22T09:30:00Z",
  },
  {
    id: 1002,
    title: "Payment processing error",
    description: "Getting error code 500 when trying to process customer payments through the system.",
    status: "in-progress",
    priority: "high",
    customerId: 2,
    customerName: "Emily Chen",
    assignedAgentId: 1,
    assignedAgentName: "Sarah Johnson",
    createdAt: "2025-01-22T08:15:00Z",
    updatedAt: "2025-01-22T10:45:00Z",
  },
  {
    id: 1003,
    title: "Feature request: Export reports to PDF",
    description: "Would be great to have the ability to export monthly reports directly to PDF format.",
    status: "open",
    priority: "low",
    customerId: 3,
    customerName: "Michael Rodriguez",
    assignedAgentId: null,
    assignedAgentName: null,
    createdAt: "2025-01-21T16:20:00Z",
    updatedAt: "2025-01-21T16:20:00Z",
  },
  {
    id: 1004,
    title: "API rate limit too restrictive",
    description: "Our application is hitting the API rate limit during peak hours. Can we increase the limit?",
    status: "in-progress",
    priority: "medium",
    customerId: 4,
    customerName: "Sarah Williams",
    assignedAgentId: 1,
    assignedAgentName: "Sarah Johnson",
    createdAt: "2025-01-21T14:00:00Z",
    updatedAt: "2025-01-22T09:00:00Z",
  },
  {
    id: 1005,
    title: "Email notifications not being received",
    description: "Haven't received any email notifications for the past 3 days. Checked spam folder as well.",
    status: "open",
    priority: "medium",
    customerId: 1,
    customerName: "John Smith",
    assignedAgentId: null,
    assignedAgentName: null,
    createdAt: "2025-01-22T11:00:00Z",
    updatedAt: "2025-01-22T11:00:00Z",
  },
  {
    id: 1006,
    title: "Mobile app crashes on iOS 17",
    description: "The mobile app crashes immediately after opening on iOS 17 devices.",
    status: "resolved",
    priority: "high",
    customerId: 2,
    customerName: "Emily Chen",
    assignedAgentId: 1,
    assignedAgentName: "Sarah Johnson",
    createdAt: "2025-01-20T10:30:00Z",
    updatedAt: "2025-01-21T15:45:00Z",
  },
]

export const mockComments: TicketComment[] = [
  {
    id: 1,
    ticketId: 1002,
    authorId: 2,
    authorName: "Emily Chen",
    authorType: "customer",
    content: "This is affecting our ability to process orders. Please prioritize this issue.",
    createdAt: "2025-01-22T08:30:00Z",
  },
  {
    id: 2,
    ticketId: 1002,
    authorId: 1,
    authorName: "Sarah Johnson",
    authorType: "agent",
    content:
      "I've escalated this to our engineering team. They're investigating the payment gateway integration. I'll keep you updated.",
    createdAt: "2025-01-22T09:15:00Z",
  },
  {
    id: 3,
    ticketId: 1002,
    authorId: 1,
    authorName: "Sarah Johnson",
    authorType: "agent",
    content: "Update: Our team identified the issue. It was related to a recent API change. We're deploying a fix now.",
    createdAt: "2025-01-22T10:45:00Z",
  },
  {
    id: 4,
    ticketId: 1004,
    authorId: 4,
    authorName: "Sarah Williams",
    authorType: "customer",
    content: "We're currently processing about 10,000 requests per hour during peak times.",
    createdAt: "2025-01-21T14:30:00Z",
  },
  {
    id: 5,
    ticketId: 1004,
    authorId: 1,
    authorName: "Sarah Johnson",
    authorType: "agent",
    content:
      "Thanks for the details. I've submitted a request to increase your rate limit to 15,000 requests per hour. This should be approved within 24 hours.",
    createdAt: "2025-01-22T09:00:00Z",
  },
  {
    id: 6,
    ticketId: 1006,
    authorId: 2,
    authorName: "Emily Chen",
    authorType: "customer",
    content: "Confirmed! The latest update fixed the crash issue. Thank you!",
    createdAt: "2025-01-21T15:45:00Z",
  },
]
