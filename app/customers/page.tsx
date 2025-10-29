/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import * as customerService from "@/services/customerService";
import { CustomerDto } from "@/types/crm-types";

export default function CustomersPage() {
  const { isAuthenticated } = useAuth();

  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {

      setIsDataLoading(true);

      customerService
        .findCustomers({ name: searchQuery })
        .then((response) => {
          setCustomers(Array.isArray(response.data) ? response.data : []);
        })
        .catch((err) => {
          console.error("Müşteriler yüklenirken hata:", err);
          setError("Müşteri verileri yüklenemedi.");
          setCustomers([]);
        })
        .finally(() => {
          setIsDataLoading(false);
        });
    }
  }, [isAuthenticated, searchQuery]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  return (
    <div className="min-h-screen bg-muted/30">
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
              <h1 className="text-lg font-semibold text-foreground">
                Customer Management
              </h1>
              <p className="text-sm text-muted-foreground">
                View and manage customer information
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Müşterileri isme, soyisme veya email'e göre ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>
        {error && (
          <Card className="p-8 text-center md:col-span-2 bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </Card>
        )}
        {isDataLoading && (
          <Card className="p-8 text-center md:col-span-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">
              Müşteriler yükleniyor...
            </p>
          </Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!isDataLoading && !error && customers.length === 0 ? (
            <Card className="p-8 text-center md:col-span-2">
              <p className="text-muted-foreground">
                Aramanızla eşleşen müşteri bulunamadı.
              </p>
            </Card>
          ) : (
            !isDataLoading &&
            !error &&
            customers.map((customer) => {
              return (
                <Card
                  key={customer.id}
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-primary" />             
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-balance">
                            {customer.firstName} {customer.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground break-all">
                          {customer.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground">
                          {customer.phone}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Müşteri {formatDate(customer.createdAt)} tarihinden
                          beri
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
