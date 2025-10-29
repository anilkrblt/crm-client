"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext" // 1. AuthContext'ten hook'u import et

export default function Home() {
  const router = useRouter()
  // 2. AuthContext'ten isLoading ve isAuthenticated durumlarını al
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // 3. Context, token'ı kontrol ederken (isLoading === true) yönlendirme YAPMA
    if (isLoading) {
      return // Yüklenmesini bekle...
    }

    // 4. Yükleme bittiğinde (isLoading === false), duruma göre yönlendir
    if (isAuthenticated) {
      // Eğer giriş yapılmışsa, dashboard'a yönlendir
      router.push("/dashboard")
    } else {
      // Giriş yapılmamışsa, login'e yönlendir
      router.push("/login")
    }
    // 5. Bağımlılıkları güncelle (isLoading, isAuthenticated ve router)
  }, [isLoading, isAuthenticated, router])

  // AuthContext token'ı kontrol ederken (isLoading) bu spinner gösterilir
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}