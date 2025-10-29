/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  Users,
  Filter,
  MoreVertical,
  ArrowLeft,
  Shield,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@/context/AuthContext";
import * as departmentService from "@/services/departmentService";
import { DepartmentDto } from "@/types/crm-types";

// Department Form Component
const DepartmentForm = ({
  department,
  isOpen,
  onClose,
}: {
  department?: DepartmentDto;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: department?.name || "",
    description: department?.description || "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: department
      ? (data: { name: string; description: string }) =>
          departmentService.updateDepartment(department.id, data)
      : departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success(
        department
          ? "Department updated successfully"
          : "Department created successfully"
      );
      onClose();
      setFormData({ name: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {department ? "Edit Department" : "Create New Department"}
          </DialogTitle>
          <DialogDescription>
            {department
              ? "Update department details and information"
              : "Add a new department to organize your teams and workflow"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Department Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g. Customer Support, Technical Team"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Brief description of the department's role and responsibilities"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="h-11"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="min-w-20"
            >
              {mutation.isPending
                ? "Saving..."
                : department
                ? "Update"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Department Card Component
const DepartmentCard = ({
  department,
  isAdmin,
}: {
  department: DepartmentDto;
  isAdmin: boolean;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => departmentService.deleteDepartment(department.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully");
      setShowDeleteDialog(false);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete department"
      );
    },
  });

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {department.name}
                </h3>
                <div className="text-muted-foreground line-clamp-2 mb-3">
                  {department.description || "No description provided"}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <Users className="w-3 h-3 mr-1" />
                    12 Teams
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    ID: {department.id}
                  </span>
                </div>
              </div>
            </div>
            
            {isAdmin && (
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
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Department
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Department
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditDialogOpen(true)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                className="flex-1"
              >
                <Users className="w-4 h-4 mr-2" />
                View Teams
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Delete Department
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department "<strong>{department.name}</strong>". 
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Department"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DepartmentForm
        department={department}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
};

// Loading Skeleton
const DepartmentCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4 pt-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
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

export default function DepartmentsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: departments = [] as DepartmentDto[],
    isLoading,
    error,
  } = useQuery<DepartmentDto[]>({
    queryKey: ["departments", searchQuery],
    queryFn: async () => {
      const response = await departmentService.findDepartments({
        ...(searchQuery && { name: searchQuery }),
      });
      return response.data;
    },
  });

  const isAdmin = user?.roles.includes("ADMIN");

  const stats = {
    total: departments.length,
    teams: departments.length * 3,
    active: departments.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-px h-6 bg-border" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Departments
                </h1>
                <p className="text-muted-foreground mt-2">
                  Organize your teams and workflow efficiently
                </p>
              </div>
            </div>

            {isAdmin && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="sm:w-auto w-full shadow-lg"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Department
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
                    Total Departments
                  </p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                    Teams
                  </p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {stats.teams}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                    Active
                  </p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                    {stats.active}
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
                    Capacity
                  </p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                    94%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Filter className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Search Departments
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by department name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                {/* Quick Filters */}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50">
                    <TabsTrigger value="all" className="flex-1 text-sm">
                      All ({stats.total})
                    </TabsTrigger>
                    <TabsTrigger value="support" className="flex-1 text-sm">
                      Support ({Math.ceil(stats.total * 0.4)})
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="flex-1 text-sm">
                      Technical ({Math.ceil(stats.total * 0.3)})
                    </TabsTrigger>
                    <TabsTrigger value="other" className="flex-1 text-sm">
                      Other ({Math.ceil(stats.total * 0.3)})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
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

        {/* Departments List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Department Overview</h2>
              <p className="text-muted-foreground">
                {departments.length} department{departments.length !== 1 ? "s" : ""} found
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {Array.from({ length: 6 }).map((_, i) => (
                viewMode === "grid" ? (
                  <DepartmentCardSkeleton key={i} />
                ) : (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                )
              ))}
            </div>
          ) : error ? (
            <Card className="p-8 text-center border-destructive/50 bg-destructive/10">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Failed to load departments
              </h3>
              <p className="text-muted-foreground mb-4">
                Please try again later or check your connection
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </Card>
          ) : departments.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No departments found</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {searchQuery
                  ? "No departments match your search criteria. Try adjusting your search terms."
                  : "Get started by creating your first department to organize your teams and workflow."
                }
              </p>
              {isAdmin && !searchQuery && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Department
                </Button>
              )}
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {departments.map((department) => (
                <DepartmentCard
                  key={department.id}
                  department={department}
                  isAdmin={isAdmin || false}
                />
              ))}
            </div>
          ) : (
            <Card>
              <div className="divide-y">
                {departments.map((department) => (
                  <div key={department.id} className="p-6 hover:bg-muted/50 group transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground truncate">
                            {department.name}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {department.description || "No description provided"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                        
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit className="w-4 h-4" />
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
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Create/Edit Dialog */}
        <DepartmentForm
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      </main>
    </div>
  );
}