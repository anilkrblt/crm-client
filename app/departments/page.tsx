/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog" // Modal için
import { Label } from "@/components/ui/label"
import { Search, PlusCircle, Edit2, Trash2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import * as departmentService from "@/services/departmentService"
import { DepartmentDto } from "@/types/crm-types"

export default function DepartmentsPage() {
  const { user } = useAuth()
  const [departments, setDepartments] = useState<DepartmentDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [selectedDept, setSelectedDept] = useState<DepartmentDto | null>(null)
  
  const [deptName, setDeptName] = useState("")
  const [deptDesc, setDeptDesc] = useState("")

  const fetchDepartments = (nameFilter: string = "") => {
    setIsLoading(true)
    setError(null)
    departmentService.findDepartments({ name: nameFilter })
      .then(response => {
        setDepartments(response.data)
      })
      .catch(err => {
        console.error("Departmanlar yüklenirken hata:", err)
        setError("Departman verileri yüklenemedi.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchDepartments(searchQuery)
  }, [searchQuery])

  const openCreateModal = () => {
    setSelectedDept(null)
    setDeptName("")
    setDeptDesc("")
    setModalError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (dept: DepartmentDto) => {
    setSelectedDept(dept)
    setDeptName(dept.name)
    setDeptDesc(dept.description)
    setModalError(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu departmanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      try {
        await departmentService.deleteDepartment(id)
        fetchDepartments(searchQuery)
      } catch (err: any) {
        console.error("Departman silinirken hata:", err)
        setError(err.response?.data?.message || "Departman silinemedi (muhtemelen kullanılıyor).")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setModalError(null)
    
    const dtoData = { name: deptName, description: deptDesc, id: selectedDept?.id || 0 }
    
    try {
      if (selectedDept) {
        await departmentService.updateDepartment(selectedDept.id, dtoData)
      } else {
        await departmentService.createDepartment(dtoData)
      }
      setIsModalOpen(false)
      fetchDepartments(searchQuery)
    } catch (err: any) {
      console.error("Departman kaydedilirken hata:", err)
      setModalError(err.response?.data?.message || "Kayıt sırasında bir hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }
  const isAdmin = user?.roles.includes("ADMIN")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Department Management</h1>
          <p className="text-muted-foreground">Şirket departmanlarını yönetin.</p>
        </div>
        {isAdmin && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateModal}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Yeni Departman
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedDept ? "Departmanı Düzenle" : "Yeni Departman Oluştur"}</DialogTitle>
                <DialogDescription>
                  {selectedDept ? "Departman detaylarını güncelleyin." : "Yeni bir departman ekleyin."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deptName">Departman Adı</Label>
                  <Input 
                    id="deptName" 
                    value={deptName} 
                    onChange={(e) => setDeptName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deptDesc">Açıklama</Label>
                  <Input 
                    id="deptDesc" 
                    value={deptDesc} 
                    onChange={(e) => setDeptDesc(e.target.value)} 
                  />
                </div>
                {modalError && (
                  <p className="text-sm text-red-600">{modalError}</p>
                )}
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>İptal</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Departman adına göre ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Yüklenme / Hata / Liste */}
      {isLoading ? (
         <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Departmanlar yükleniyor...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700">
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </Card>
      ) : departments.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Departman bulunamadı.</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Departman Adı</TableHead>
                <TableHead>Açıklama</TableHead>
                {isAdmin && <TableHead className="text-right">Aksiyonlar</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-muted-foreground">{dept.description}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(dept)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(dept.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
