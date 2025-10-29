export interface CustomerDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentDto {
  id: number
  firstName: string
  lastName: string
  email: string
  departmentName: string
}

export interface DepartmentDto {
  id: number
  name: string
}

export interface TicketDto {
  id: number
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  customer: CustomerDto
  department: DepartmentDto
  assignedAgent: AgentDto | null
  createdAt: string
  updatedAt: string
}

export interface TicketCommentDto {
  id: number;
  ticketId: number;
  comment: string;
  authorFirstName: string;
  authorLastName: string;
  authorRole: UserRole;
  createdAt: string;
}

export interface DepartmentDto {
  id: number
  name: string
  description: string
}

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "ON_HOLD" | "CLOSED" | "RESOLVED"
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"
export type UserRole = "ADMIN" | "AGENT" | "CUSTOMER";