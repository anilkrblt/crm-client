"use client"

import { useState, useMemo, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, LogOut, User, Clock, AlertCircle, Users, Building2, Filter, SortAsc } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useAuth } from "@/context/AuthContext"
import * as ticketService from "@/services/ticketService"
import { TicketDto, TicketPriority, TicketStatus } from "@/types/crm-types"

// Types for filters
interface TicketFilters {
  search: string
  status: string
  priority: string
  sortBy: string
}

// Stats card component
const StatsCard = ({ title, value, icon: Icon, color }: {
  title: string
  value: number
  icon: React.ElementType
  color: string
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </CardContent>
  </Card>
)

// Ticket card component
const TicketCard = ({ ticket }: { ticket: TicketDto }) => {
  const statusColors: Record<TicketStatus, string> = {
    OPEN: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
    IN_PROGRESS: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800",
    ON_HOLD: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700",
    CLOSED: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700",
    RESOLVED: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800"
  }

  const priorityColors: Record<TicketPriority, string> = {
    URGENT: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800",
    HIGH: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800",
    MEDIUM: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
    LOW: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
  }

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }, [])

  return (
    <Link href={`/tickets/${ticket.id}`}>
      <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                #{ticket.id}
              </span>
              <Badge variant="outline" className={priorityColors[ticket.priority]}>
                {ticket.priority}
              </Badge>
              <Badge variant="outline" className={statusColors[ticket.status]}>
                {ticket.status.replace("_", " ")}
              </Badge>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                {ticket.subject}
              </h3>
              <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                {ticket.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {ticket.customer.firstName} {ticket.customer.lastName}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{ticket.customer.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatDate(ticket.createdAt)}
              </span>

              {ticket.assignedAgent ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {ticket.assignedAgent.firstName} {ticket.assignedAgent.lastName}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{ticket.assignedAgent.departmentName}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {ticket.department.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

// Loading skeleton
const TicketCardSkeleton = () => (
  <Card className="p-6">
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  </Card>
)

export default function DashboardPage() {
  const { user, logout } = useAuth()
  
  const [filters, setFilters] = useState<TicketFilters>({
    search: "",
    status: "all",
    priority: "all",
    sortBy: "newest"
  })

  // Fetch tickets with React Query
  const { data: tickets = [], isLoading, error } = useQuery<TicketDto[]>({
    queryKey: ["tickets", filters],
    queryFn: async () => {
      const res = await ticketService.findTickets({
        ...(filters.search && { search: filters.search }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.priority !== "all" && { priority: filters.priority }),
      })
      return res.data
    },
    enabled: !!user,
  })

  // Memoized ticket statistics
  const stats = useMemo(() => ({
    open: tickets.filter((t: { status: string }) => t.status === "OPEN").length,
    inProgress: tickets.filter((t: { status: string }) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t: { status: string }) => t.status === "RESOLVED" || t.status === "CLOSED").length,
    total: tickets.length
  }), [tickets])

  // Memoized sorted tickets
  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "priority":
          const priorityOrder: Record<TicketPriority, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        default:
          return 0
      }
    })
  }, [tickets, filters.sortBy])

  const handleFilterChange = useCallback((key: keyof TicketFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Please log in to access the dashboard</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Support Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Manage customer tickets efficiently</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-1">
                <Link href="/customers">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Users className="w-4 h-4" />
                    Customers
                  </Button>
                </Link>
                {user.roles.includes("ADMIN") && (
                  <>
                    <Link href="/agents">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="w-4 h-4" />
                        Agents
                      </Button>
                    </Link>
                    <Link href="/departments">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Building2 className="w-4 h-4" />
                        Departments
                      </Button>
                    </Link>
                  </>
                )}
              </nav>

              <div className="w-px h-6 bg-border mx-2" />

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {user.roles.join(', ').toLowerCase()}
                    </div>
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={logout} className="rounded-lg">
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tickets"
            value={stats.total}
            icon={AlertCircle}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
          />
          <StatsCard
            title="Open"
            value={stats.open}
            icon={AlertCircle}
            color="bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            color="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={AlertCircle}
            color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300"
          />
        </div>

        {/* Filters Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              <div className="flex-1 w-full">
                <label className="text-sm font-medium mb-2 block">Search Tickets</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, subject, or customer name..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger className="w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
                    <SelectTrigger className="w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                    <SelectTrigger className="w-full">
                      <SortAsc className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Status Filter Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-5 w-full max-w-md">
            <TabsTrigger value="all" onClick={() => handleFilterChange("status", "all")}>
              All ({tickets.length})
            </TabsTrigger>
            <TabsTrigger value="OPEN" onClick={() => handleFilterChange("status", "OPEN")}>
              Open ({stats.open})
            </TabsTrigger>
            <TabsTrigger value="IN_PROGRESS" onClick={() => handleFilterChange("status", "IN_PROGRESS")}>
              In Progress ({stats.inProgress})
            </TabsTrigger>
            <TabsTrigger value="RESOLVED" onClick={() => handleFilterChange("status", "RESOLVED")}>
              Resolved ({stats.resolved})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <TicketCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-8 text-center border-destructive/50 bg-destructive/10">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load tickets</h3>
            <p className="text-muted-foreground">Please try again later</p>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedTickets.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
            <p className="text-muted-foreground mb-6">
              {filters.search || filters.status !== "all" || filters.priority !== "all"
                ? "Try adjusting your filters to find what you're looking for."
                : "No tickets have been created yet."}
            </p>
            {(filters.search || filters.status !== "all" || filters.priority !== "all") && (
              <Button onClick={() => setFilters({ search: "", status: "all", priority: "all", sortBy: "newest" })}>
                Clear Filters
              </Button>
            )}
          </Card>
        )}

        {/* Tickets List */}
        {!isLoading && !error && sortedTickets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {sortedTickets.length} of {tickets.length} tickets
              </p>
            </div>
            {sortedTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}