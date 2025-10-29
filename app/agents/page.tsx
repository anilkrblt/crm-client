/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, PlusCircle, User, Mail, Building2, Edit } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import * as agentService from "@/services/agentService"
import { useSearchParams, useRouter } from "next/navigation"
import { AgentDto } from "@/types/crm-types"

function AgentList() {
  const [agents, setAgents] = useState<AgentDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const name = searchParams.get("name") || ""
  const department = searchParams.get("department") || ""

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    agentService.findAgents({ name, department })
      .then(response => {
        setAgents(response.data)
      })
      .catch(err => {
        console.error("Ajanlar yüklenirken hata:", err)
        setError("Ajan verileri yüklenemedi.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [name, department])

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Ajanlar yükleniyor...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700">
        <p className="text-red-700 dark:text-red-200">{error}</p>
      </Card>
    )
  }

  if (agents.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Filtrelerinizle eşleşen ajan bulunamadı.</p>
      </Card>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>İsim / Email</TableHead>
            <TableHead>Departman</TableHead>
            <TableHead><span className="sr-only">Aksiyonlar</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell>
                <div className="font-medium">{agent.firstName} {agent.lastName}</div>
                <div className="text-sm text-muted-foreground">{agent.email}</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{agent.departmentName}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/agents/${agent.id}`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export default function AgentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [nameQuery, setNameQuery] = useState(searchParams.get("name") || "")
  const [deptQuery, setDeptQuery] = useState(searchParams.get("department") || "")
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/agents?name=${nameQuery}&department=${deptQuery}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agent Management</h1>
          <p className="text-muted-foreground">Sistemdeki ajanları görüntüleyin ve yönetin.</p>
        </div>
        {user?.roles.includes("ADMIN") && (
          <Button asChild>
            <Link href="/agents/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Yeni Ajan Oluştur
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Ajan adı veya soyadına göre ara..."
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative flex-1">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Departman adına göre ara..."
                value={deptQuery}
                onChange={(e) => setDeptQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Ara</Button>
          </form>
        </CardContent>
      </Card>
      <Suspense fallback={
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Ajanlar yükleniyor...</p>
        </Card>
      }>
        <AgentList />
      </Suspense>
    </div>
  )
}
