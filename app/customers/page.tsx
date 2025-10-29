"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCustomers, mockTickets, type Customer, type Agent } from "@/lib/mock-data"
import { Search, ArrowLeft, User, Mail, Phone, Building2, Calendar } from "lucide-react"
import Link from "next/link"

export default function CustomersPage() {
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const agentData = localStorage.getItem("agent")
    if (!agentData) {
      router.push("/login")
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAgent(JSON.parse(agentData))
    }
  }, [router])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getCustomerTickets = (customerId: number) => {
    return mockTickets.filter((ticket) => ticket.customerId === customerId)
  }

  const getCustomerStats = (customerId: number) => {
    const tickets = getCustomerTickets(customerId)
    return {
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in-progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
    }
  }

  if (!agent) {
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
              <h1 className="text-lg font-semibold text-foreground">Customer Management</h1>
              <p className="text-sm text-muted-foreground">View and manage customer information</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Customer List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCustomers.length === 0 ? (
            <Card className="p-8 text-center md:col-span-2">
              <p className="text-muted-foreground">No customers found matching your search.</p>
            </Card>
          ) : (
            filteredCustomers.map((customer) => {
              const stats = getCustomerStats(customer.id)
              const tickets = getCustomerTickets(customer.id)
              return (
                <Card key={customer.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    {/* Customer Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-balance">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{customer.company}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">
                        {customer.totalTickets} tickets
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground break-all">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground">{customer.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Customer since {formatDate(customer.createdAt)}</span>
                      </div>
                    </div>

                    {/* Ticket Stats */}
                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.open}</div>
                          <div className="text-xs text-muted-foreground">Open</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                            {stats.inProgress}
                          </div>
                          <div className="text-xs text-muted-foreground">In Progress</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {stats.resolved}
                          </div>
                          <div className="text-xs text-muted-foreground">Resolved</div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Tickets */}
                    {tickets.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <h4 className="text-sm font-medium text-foreground mb-2">Recent Tickets</h4>
                        <div className="space-y-2">
                          {tickets.slice(0, 2).map((ticket) => (
                            <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                              <div className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono text-muted-foreground">#{ticket.id}</span>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      ticket.priority === "urgent" || ticket.priority === "high"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        : ""
                                    }
                                  >
                                    {ticket.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-foreground line-clamp-1">{ticket.title}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
