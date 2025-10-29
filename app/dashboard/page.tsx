"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Yönlendirme için hâlâ gerekli olabilir
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, LogOut, User, Clock, AlertCircle, Users } from "lucide-react"
import Link from "next/link"

// 1. AuthContext ve Servisleri Import Et
import { useAuth } from "@/context/AuthContext"
import * as ticketService from "@/services/ticketService"

// 2. Backend DTO'ları ile eşleşen TİPLERİ tanımla
// (Bu tipler /src/types/crm-types.ts gibi merkezi bir dosyada olmalı)
type TicketStatus = "OPEN" | "IN_PROGRESS" | "ON_HOLD" | "CLOSED"
type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

// Backend DTO'larına göre tipler
interface CustomerDto {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
}

interface AgentDto {
  id: number
  firstName: string
  lastName: string
  email: string
  departmentName: string
}

interface DepartmentDto {
  id: number
  name: string
}

interface TicketDto {
  id: number
  subject: string // 'title' yerine 'subject'
  description: string
  status: TicketStatus
  priority: TicketPriority
  customer: CustomerDto // 'customerId' ve 'customerName' yerine nesne
  department: DepartmentDto
  assignedAgent: AgentDto | null // 'assignedAgentId' ve 'assignedAgentName' yerine nesne
  createdAt: string
  updatedAt: string
}
// --- Tip Tanımları Bitti ---

export default function DashboardPage() {
  const router = useRouter()
  // 3. AuthContext'ten gerçek kullanıcı, logout ve yüklenme durumunu al
  const { user, logout, isLoading: isAuthLoading } = useAuth()
  
  // 4. State'leri mock data yerine boş dizi ile başlat
  const [tickets, setTickets] = useState<TicketDto[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true) // Veri yükleme
  const [error, setError] = useState<string | null>(null) // Hata
  
  // Filtre state'leri (aynı kalır)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  // 5. Veri Çekme (Data Fetching)
  // Bu useEffect, arama/filtreleme parametreleri her değiştiğinde API'yi çağırır
  useEffect(() => {
    // Sadece kimlik doğrulaması tamamlandıysa ve kullanıcı varsa veri çek
    if (!isAuthLoading && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDataLoading(true)
      
      // Filtreleri 'params' objesi olarak hazırla
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = {}
      if (searchQuery) params.name = searchQuery; // Veya backend'deki adı neyse
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;
      
      // Backend'deki birleşik filtreleme endpoint'ini çağır
      // (Şimdilik sadece 'findTickets' olduğunu varsayıyoruz)
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
  }, [isAuthLoading, user, searchQuery, statusFilter, priorityFilter]) // Filtreler değiştiğinde tekrar çek

  // 6. Logout fonksiyonunu AuthContext'e bağla
  const handleLogout = () => {
    logout() // Context'teki logout fonksiyonunu çağırır
  }

  // 7. Client-side filtreleme kaldırıldı (Server-side yapılıyor varsayımı)
  // const filteredTickets = tickets.filter(...) // <-- KALDIRILDI

  // 8. Sıralama (Sort) - Bu hâlâ client-side yapılabilir
  const sortedTickets = [...tickets] // Yeni bir kopya oluştur
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

  // Renk ve Tarih fonksiyonları (Enum isimlerini kullanacak şekilde güncellendi)
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
    // ... (formatDate fonksiyonu aynı kalabilir)
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

  // 9. İstatistikler (Backend'den çekilen tüm biletlere göre hesaplanır)
  const stats = {
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length,
  }

  // 10. Ana Yükleme Durumu (AuthContext'ten)
  // Bu, (dashboard)/layout.tsx tarafından zaten ele alınıyor,
  // bu yüzden bu sayfada tekrar göstermeye gerek yok (layout halleder).
  // if (isAuthLoading || !user) { ... } // <-- KALDIRILDI

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header (Kullanıcı bilgisi 'user' context'inden alındı) */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* ... (Başlık kısmı aynı) ... */}
            <div className="flex items-center gap-3">...</div>

            {user && ( // Kullanıcı yüklendiyse göster
              <div className="flex items-center gap-4">
                <Link href="/customers">
                  <Button variant="ghost" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Customers
                  </Button>
                </Link>
                {/* ADMIN ise Ajanlar ve Departmanlar butonlarını göster */}
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
        {/* Stats (Aynı kalır, 'stats' objesi güncellendi) */}
        {/* ... (stats kartları) ... */}


        {/* Filters (Filtre seçenekleri Enum'lara göre güncellendi) */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ID, konu veya müşteri adına göre ara..." // Güncellendi
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* ENUM'lar büyük harf olacak şekilde güncellendi */}
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
            {/* ... (Sıralama aynı kalır) ... */}
          </div>
        </Card>

        {/* Yüklenme ve Hata Durumları */}
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

        {/* Ticket List (DTO'ya göre güncellendi) */}
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
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.customer.firstName} {ticket.customer.lastName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(ticket.createdAt)}
                        </span>
                        {ticket.assignedAgent ? ( // Atanmış ajan varsa göster
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Assigned to {ticket.assignedAgent.firstName} {ticket.assignedAgent.lastName}
                          </span>
                        ) : ( // Ajan atanmamışsa departmanı göster
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
