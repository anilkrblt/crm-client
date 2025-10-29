/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Headset } from "lucide-react"

export default function LoginPage() {
  
  const { login } = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(email, password)
    } catch (err: any) {
      console.error("Login failed:", err)
      const apiErrorMessage = err.response?.data?.message || "Email veya şifre hatalı."
      setError(apiErrorMessage)
      setIsLoading(false)
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
            {error && (
              <div className="text-center text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Please enter your agent credentials.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}