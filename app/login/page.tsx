"use client"

import type React from "react"
// 1. Gerekli hook'ları import et
import { useState } from "react"
import { useAuth } from "@/context/AuthContext" // <-- AuthContext'ten hook'u al
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// useRouter'a artık gerek yok, AuthContext yönlendirmeyi yapıyor
// import { useRouter } from "next/navigation" 
import { Headset } from "lucide-react"

// TypeScript kullanıyorsan (AuthContext'e bakılırsa evet), dosya adını page.tsx yapman daha iyi olur
export default function LoginPage() {
  // const router = useRouter() // <-- Artık AuthContext yönlendirmeyi yapacak
  
  // 2. AuthContext'ten 'login' fonksiyonunu al
  const { login } = useAuth() // <-- Context'ten login'i çek
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // 3. API'den gelen hataları göstermek için yeni bir state ekle
  // Eğer .jsx dosyası kullanıyorsan: const [error, setError] = useState(null)
  const [error, setError] = useState<string | null>(null) // <-- Hata state'i (TypeScript)

  // 4. handleLogin fonksiyonunu gerçek API çağrısıyla güncelle
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null) // Her yeni denemede eski hatayı temizle

    try {
      // AuthContext'ten gelen login fonksiyonunu çağır
      // Bu fonksiyon (AuthContext.tsx içinde) API'yi çağırır,
      // token'ı kaydeder ve yönlendirme yapar.
      await login(email, password)
      
      // Başarılı olursa, AuthContext zaten yönlendirme yapacağı için
      // burada router.push() demeye gerek yok.
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) { // 'any' veya 'unknown' kullanabilirsin
      // Hata yakalanırsa (AuthContext'ten 'throw error' ile fırlatıldı)
      console.error("Login failed:", err)
      
      // GlobalExceptionHandler'dan gelen mesajı veya genel bir hata mesajını ayarla
      const apiErrorMessage = err.response?.data?.message || "Email veya şifre hatalı."
      setError(apiErrorMessage)
      setIsLoading(false) // Yükleniyor durumunu durdur
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Headset className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Agent Portal</CardTitle>
          <CardDescription>Sign in to access your support dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="agent@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* 5. Hata mesajını göstermek için bu bloğu ekle (Görüntüyü bozmaz) */}
            {error && (
              <div className="text-center text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          {/* 6. Demo mesajını güncelle */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Please enter your agent credentials.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}