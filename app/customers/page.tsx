"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowLeft, User, Mail, Phone, Calendar, MapPin, Shield } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@/context/AuthContext";
import * as customerService  from "@/services/customerService";
import { CustomerDto } from "@/types/crm-types";

// Customer Card Component
const CustomerCard = ({ customer }: { customer: CustomerDto }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      full: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      relative: diffDays === 1 ? "1 day ago" : `${diffDays} days ago`
    };
  };

  const dateInfo = formatDate(customer.createdAt);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                {customer.firstName} {customer.lastName}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {customer.email}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
            Active
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Email</p>
              <p className="text-foreground font-medium truncate">{customer.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Phone</p>
              <p className="text-foreground font-medium">{customer.phone || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Member since</p>
              <p className="text-foreground font-medium" title={dateInfo.full}>
                {dateInfo.relative}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Customer ID</p>
              <p className="text-foreground font-mono font-medium">#{customer.id}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            View Profile
          </Button>
          <Button size="sm" className="flex-1">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const CustomerCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4 pt-4">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </CardContent>
  </Card>
);

export default function CustomersPage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ["customers", searchQuery],
    queryFn: async () => {
      const response = await customerService.findCustomers({ 
        ...(searchQuery && { name: searchQuery }) 
      });
      return response.data;
    },
    enabled: isAuthenticated,
  });

  // Filter customers based on active tab
  const filteredCustomers = customers.filter((customer: { createdAt: string | number | Date; }) => {
    if (activeTab === "all") return true;
    if (activeTab === "recent") {
      const customerDate = new Date(customer.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return customerDate > thirtyDaysAgo;
    }
    return true;
  });

  const stats = {
    total: customers.length,
    recent: customers.filter((customer: { createdAt: string | number | Date; }) => {
      const customerDate = new Date(customer.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return customerDate > thirtyDaysAgo;
    }).length,
    active: customers.length // Assuming all are active for now
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-px h-6 bg-border" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Customer Management
                </h1>
                <p className="text-muted-foreground">
                  View and manage customer information
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <User className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All registered customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recent}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Shield className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Currently active customers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              <div className="flex-1 w-full">
                <label className="text-sm font-medium mb-2 block">Search Customers</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full lg:w-auto">
                <label className="text-sm font-medium mb-2 block">Filter</label>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-[400px]">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="all">
                      All ({stats.total})
                    </TabsTrigger>
                    <TabsTrigger value="recent">
                      Recent ({stats.recent})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                      Active ({stats.active})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CustomerCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-8 text-center border-destructive/50 bg-destructive/10">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Failed to load customers
            </h3>
            <p className="text-muted-foreground mb-4">
              Please try again later or check your connection
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredCustomers.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No customers found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery || activeTab !== "all"
                ? "No customers match your current filters. Try adjusting your search criteria."
                : "No customers have been registered yet."}
            </p>
            {(searchQuery || activeTab !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </Card>
        )}

        {/* Customers Grid */}
        {!isLoading && !error && filteredCustomers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Customers</h2>
                <p className="text-muted-foreground">
                  {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCustomers.map((customer: CustomerDto) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}