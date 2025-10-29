/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Plus,
  User,
  Mail,
  Building2,
  Edit,
  MoreVertical,
  Users,
  Shield,
  Phone,
  Calendar,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@/context/AuthContext";
import * as agentService from "@/services/agentService";
import { AgentDto } from "@/types/crm-types";

// Agent Card Component
const AgentCard = ({ agent }: { agent: AgentDto }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                {agent.firstName} {agent.lastName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Mail className="w-3 h-3" />
                <span className="truncate">{agent.email}</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
              >
                <Building2 className="w-3 h-3 mr-1" />
                {agent.departmentName}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/agents/${agent.id}`}
                  className="flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Agent
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/agents/${agent.id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button size="sm" className="flex-1" variant="secondary">
            <Mail className="w-4 h-4 mr-2" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Agent Row Component (Table view)
const AgentRow = ({ agent }: { agent: AgentDto }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 group transition-colors">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground truncate">
            {agent.firstName} {agent.lastName}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-3 h-3" />
            <span className="truncate">{agent.email}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
        >
          <Building2 className="w-3 h-3 mr-1" />
          {agent.departmentName}
        </Badge>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Link href={`/agents/${agent.id}`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/agents/${agent.id}`}
                  className="flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Agent
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const AgentCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-md" />
      </div>
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </CardContent>
  </Card>
);

export default function AgentsPage() {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState({
    name: "",
    department: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: agents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agents", searchQuery],
    queryFn: () =>
      agentService.findAgents(searchQuery).then((res) => {
        return (res as any)?.data ?? res;
      }),
  });

  const handleSearchChange = (
    field: keyof typeof searchQuery,
    value: string
  ) => {
    setSearchQuery((prev) => ({ ...prev, [field]: value }));
  };

  const stats = {
    total: agents.length,
    byDepartment: agents.reduce((acc: { [x: string]: any; }, agent: { departmentName: string | number; }) => {
      acc[agent.departmentName] = (acc[agent.departmentName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const uniqueDepartments = [
    ...new Set(agents.map((agent: { departmentName: any; }) => agent.departmentName)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Team Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your support team and agents
              </p>
            </div>

            {user?.roles.includes("ADMIN") && (
              <Button asChild className="sm:w-auto w-full shadow-lg">
                <Link href="/agents/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Agent
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Total Agents
                  </p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                    Departments
                  </p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {uniqueDepartments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                    Teams
                  </p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                    {Math.ceil(stats.total / 3)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">
                    Active
                  </p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Search by name
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Agent name..."
                        value={searchQuery.name}
                        onChange={(e) => handleSearchChange("name", e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Search by department
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Department name..."
                        value={searchQuery.department}
                        onChange={(e) =>
                          handleSearchChange("department", e.target.value)
                        }
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Department Filters */}
                {uniqueDepartments.length > 0 && (
                  <div className="pt-2">
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50">
                        <TabsTrigger value="all" className="flex-1 text-sm">
                          All ({stats.total})
                        </TabsTrigger>
                        {uniqueDepartments.slice(0, 3).map((dept) => {
                          const deptKey = String(dept);
                          const count = stats.byDepartment[deptKey] ?? 0;
                          return (
                            <TabsTrigger key={deptKey} value={deptKey} className="flex-1 text-sm">
                              {deptKey} ({count})
                            </TabsTrigger>
                          );
                        })}
                        {uniqueDepartments.length > 3 && (
                          <TabsTrigger value="more" className="flex-1 text-sm">
                            +{uniqueDepartments.length - 3} More
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </Tabs>
                  </div>
                )}
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                <div className="flex bg-muted/50 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="px-3"
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-3"
                  >
                    List
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agents List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Team Members</h2>
              <p className="text-muted-foreground">
                {agents.length} agent{agents.length !== 1 ? "s" : ""} found
                {searchQuery.name && ` matching "${searchQuery.name}"`}
                {searchQuery.department && ` in "${searchQuery.department}"`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-3"
            }>
              {Array.from({ length: 6 }).map((_, i) => (
                viewMode === "grid" ? (
                  <AgentCardSkeleton key={i} />
                ) : (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                )
              ))}
            </div>
          ) : error ? (
            <Card className="p-8 text-center border-destructive/50 bg-destructive/10">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Failed to load agents
              </h3>
              <p className="text-muted-foreground mb-4">
                Please try again later or check your connection
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </Card>
          ) : agents.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No agents found</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {searchQuery.name || searchQuery.department
                  ? "No agents match your search criteria. Try adjusting your search terms."
                  : "Get started by adding your first team member."
                }
              </p>
              {user?.roles.includes("ADMIN") &&
                !searchQuery.name &&
                !searchQuery.department && (
                  <Button asChild size="lg">
                    <Link href="/agents/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Agent
                    </Link>
                  </Button>
                )}
              {(searchQuery.name || searchQuery.department) && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery({ name: "", department: "" })}
                >
                  Clear Search
                </Button>
              )}
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {agents.map((agent: AgentDto) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <Card>
              <div className="divide-y">
                {agents.map((agent: AgentDto) => (
                  <AgentRow key={agent.id} agent={agent} />
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}