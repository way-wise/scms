"use client";

import type React from "react";

import {
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { api, useData } from "@/lib/utils";

// Update the PagesPage component to include the new page modal
export default function PagesPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageDescription, setNewPageDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: allPages, mutate: mutatePages } = useData("/api/pages");

  const handleDeletePage = async () => {
    let toastData: any = {};
    try {
      if (pageToDelete) {
        console.log("pageToDelete", pageToDelete);
        // TODO: Delete the page
        const response = await api.delete(`/api/pages/${pageToDelete}`);
        mutatePages();
        toastData = response.data;
      }
    } catch (error: any) {
      toastData = error.response.data;
    } finally {
      setPageToDelete(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: toastData.message,
        duration: 3000,
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setNewPageTitle(newTitle);

    // Auto-generate slug from title if slug is empty
    if (!newPageSlug) {
      setNewPageSlug(
        newTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create a new page object
    const newPage = {
      title: newPageTitle,
      slug: newPageSlug,
      meta_title: newPageTitle,
      meta_description: newPageDescription,
      updated_at: new Date().toISOString(),
      sections: [],
    };

    let toastData: any = {};

    try {
      const response = await api.post("/api/pages", newPage);
      mutatePages();
      toastData = response.data;
    } catch (error: any) {
      toastData = error.response.data;
    } finally {
      setNewPageTitle("");
      setNewPageSlug("");
      setNewPageDescription("");
      setIsSubmitting(false);
      setIsNewPageDialogOpen(false);
      toast({
        title: toastData.message,
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">
            Manage your website pages and their content.
          </p>
        </div>
        <Button onClick={() => setIsNewPageDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Page
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search pages..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allPages?.map((page: any) => (
          <Card key={page.slug}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-xl">{page.title}</CardTitle>
                <CardDescription>/{page.slug}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      setPageToDelete(page.slug);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <FileText className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{page.sections.length} sections</span>
                </div>
                <div className="text-muted-foreground">
                  Updated {page.updated_at}
                </div>
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/pages/${page.slug}`}>
                    Manage Content
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Page Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this page?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              page and all its sections.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Page Dialog */}
      <Dialog open={isNewPageDialogOpen} onOpenChange={setIsNewPageDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Add a new page to your website. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePage}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Home, About Us, Contact"
                  value={newPageTitle}
                  onChange={handleTitleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <Input
                    id="slug"
                    placeholder="e.g., home, about-us, contact"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  This will be the URL path for your page
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this page"
                  value={newPageDescription}
                  onChange={(e) => setNewPageDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsNewPageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Creating..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Page
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
