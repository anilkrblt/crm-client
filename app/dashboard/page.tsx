/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, LogOut, User, Clock, AlertCircle, Users, Building2 } from "lucide-react" 
import Link from "next/link"

import { useAuth } from "@/context/AuthContext"
import * as ticketService from "@/services/ticketService"
import { AgentDto, CustomerDto, TicketDto, TicketPriority, TicketStatus } from "@/types/crm-types"


export default function DashboardPage() {
  const { user, logout, isLoading: isAuthLoading } = useAuth()
  
  const [tickets, setTickets] = useState<TicketDto[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  useEffect(() => {
    if (!isAuthLoading && user) {
      setIsDataLoading(true)
      
      const params: any = {}
      
      if (searchQuery) params.name = searchQuery;
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;
      
      ticketService.findTickets(params)
        .then(response => {
          setTickets(response.data)
        })
        .catch(err => {
          console.error("Biletler yüklenirken hata:", err)
          setError("Biletler yüklenemedi. Lütfen daha sonra tekrar deneyin.")
        })
        .finally(() => {
          setIsDataLoading(false)
        })
    }
  }, [isAuthLoading, user, searchQuery, statusFilter, priorityFilter])

  const handleLogout = () => {
    logout()
  }

  const sortedTickets = [...tickets] 
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "priority":
          const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        default:
          return 0
      }
    })

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "OPEN": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "RESOLVED": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "CLOSED": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: TicketPriority) => {
     switch (priority) {
      case "URGENT": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "HIGH": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "MEDIUM": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "LOW": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const stats = {
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length,
  }

  return (
    <div className="bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Support Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage customer tickets</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <Link href="/customers">
                  <Button variant="ghost" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Customers
                  </Button>
                </Link>
                {user.roles.includes("ADMIN") && (
                  <>
                    <Link href="/agents">
                      <Button variant="ghost" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        Agents
                      </Button>
                    </Link>
                    <Link href="/departments">
                      <Button variant="ghost" size="sm">
                        <Building2 className="w-4 h-4 mr-2" />
                        Departments
                      </Button>
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-muted-foreground">{user.roles.join(', ')}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold text-foreground">{stats.open}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </Card>
        </div>
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ID, konu veya müşteri adına göre ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {isDataLoading && (
           <Card className="p-8 text-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
             <p className="text-muted-foreground mt-4">Biletler yükleniyor...</p>
           </Card>
        )}
        {error && (
           <Card className="p-8 text-center bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700">
             <p className="text-red-700 dark:text-red-200">{error}</p>
           </Card>
        )}

        <div className="space-y-3">
          {!isDataLoading && !error && sortedTickets.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Filtrelerinizle eşleşen bilet bulunamadı.</p>
            </Card>
          ) : (
            !isDataLoading && !error && sortedTickets.map((ticket) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono text-muted-foreground">#{ticket.id}</span>
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 text-balance">{ticket.subject}</h3> 
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{ticket.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.customer.firstName} {ticket.customer.lastName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(ticket.createdAt)}
                        </span>
                        {ticket.assignedAgent ? ( 
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Assigned to {ticket.assignedAgent.firstName} {ticket.assignedAgent.lastName}
                          </span>
                        ) : (
                           <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Dept: {ticket.department.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}