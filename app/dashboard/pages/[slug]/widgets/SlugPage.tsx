"use client";

import type React from "react";

import {
  ArrowLeft,
  Eye,
  GripVertical,
  Layers,
  MoreHorizontal,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { api, useData } from "@/lib/utils";
import { MediaUpload } from "../media-upload";

export default function SlugPage({ slug }: { slug: string }) {
  const isNewPage = slug === "new";
  const { data: pageData, mutate: mutatePage } = useData(`/api/pages/${slug}`);
  console.log("pageData", pageData);

  // Create an empty page template for new pages
  const emptyPage = {
    id: "new",
    title: "New Page",
    slug: "new-page",
    description: "",
    sections: [],
  };

  // Get the page from mockPages or use the empty template if it's a new page or if the page doesn't exist
  const [page, setPage] = useState(() => {
    if (isNewPage) {
      return emptyPage;
    }

    return pageData ? pageData : emptyPage;
  });

  const [activeSection, setActiveSection] = useState<string | null>(
    pageData?.sections.length > 0 ? pageData?.sections[0].title : null
  );
  const { data: propertyData, mutate: mutateProperty } = useData(
    `/api/pages/section/property?slug=${slug}&sectionTitle=${activeSection}`
  );

  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [isDeleteSectionDialogOpen, setIsDeleteSectionDialogOpen] =
    useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [isAddPropertyDialogOpen, setIsAddPropertyDialogOpen] = useState(false);
  const [newPropertyName, setNewPropertyName] = useState("");
  const [newPropertyType, setNewPropertyType] = useState("string");
  const [newPropertyValue, setNewPropertyValue] = useState("");
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [editedPropertyValues, setEditedPropertyValues] = useState<
    Record<string, any>
  >({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{
    sectionTitle: string;
    propertyTitle: string;
  } | null>(null);
  const [isDeletePropertyDialogOpen, setIsDeletePropertyDialogOpen] =
    useState(false);

  const handleAddSection = async () => {
    if (newSectionName.trim()) {
      const newSection = {
        title: newSectionName.trim(),
        page: slug,
        properties: [],
      };

      let toastData: any = {};
      try {
        const response = await api.post(
          `/api/pages/section?slug=${slug}&sectionTitle=${newSectionName}`,
          newSection
        );
        toastData = response.data;
        mutatePage();
      } catch (error: any) {
        toastData = error.response.data;
      } finally {
        toast({
          title: toastData.message,
          duration: 3000,
        });
      }

      setPage({
        ...page,
        sections: [...page.sections, newSection],
      });

      setHasUnsavedChanges(true);
      setActiveSection(newSection.title);
      setNewSectionName("");
      setIsAddSectionDialogOpen(false);
    }
  };

  const handleDeleteSection = async () => {
    if (sectionToDelete) {
      let toastData: any = {};
      try {
        const response = await api.delete(
          `/api/pages/section?slug=${slug}&sectionTitle=${sectionToDelete}`
        );
        toastData = response.data;
        mutatePage();
        setActiveSection(null);
        mutateProperty();
      } catch (error: any) {
        toastData = error.response.data;
      } finally {
        toast({
          title: toastData.message,
          duration: 3000,
        });

        setHasUnsavedChanges(true);
        setSectionToDelete(null);
        setIsDeleteSectionDialogOpen(false);
      }
    }
  };

  const handleAddProperty = async () => {
    const newProperty = {
      title: newPropertyName,
      type: newPropertyType,
      value: newPropertyValue,
    };

    let toastData: any = {};
    try {
      const response = await api.post(
        `/api/pages/section/property?slug=${slug}&sectionTitle=${activeSection}&propertyTitle=${newPropertyName}`,
        newProperty
      );
      toastData = response.data;
      mutatePage();
      mutateProperty();
    } catch (error: any) {
      toastData = error.response.data;
    } finally {
      toast({
        title: toastData.message,
        duration: 3000,
      });

      setHasUnsavedChanges(true);
      setNewPropertyName("");
      setNewPropertyType("string");
      setNewPropertyValue("");
      setIsAddPropertyDialogOpen(false);
    }
  };

  const handleUpdateProperty = (
    sectionId: string,
    propertyName: string,
    value: any
  ) => {
    // Store the edited value in the temporary state
    setEditedPropertyValues({
      ...editedPropertyValues,
      [`${sectionId}-${propertyName}`]: value,
    });
  };

  const handleSaveProperty = async (
    sectionTitle: string,
    propertyName: string,
    displayValue: any
  ) => {
    let toastData: any = {};
    try {
      const response = await api.patch(
        `/api/pages/section/property?slug=${slug}&sectionTitle=${sectionTitle}&propertyTitle=${propertyName}`,
        {
          value: displayValue,
        }
      );
      toastData = response.data;
      mutatePage();
      mutateProperty();
    } catch (error: any) {
      toastData = error.response.data;
    } finally {
      toast({
        title: toastData.message,
        duration: 3000,
      });
    }
  };

  const handleConfirmDeleteProperty = async () => {
    if (propertyToDelete) {
      const { sectionTitle, propertyTitle } = propertyToDelete;

      let toastData: any = {};
      try {
        const response = await api.delete(
          `/api/pages/section/property?slug=${slug}&sectionTitle=${sectionTitle}&propertyTitle=${propertyTitle}`
        );
        toastData = response.data;
        mutatePage();
        mutateProperty();
      } catch (error: any) {
        toastData = error.response.data;
      } finally {
        toast({
          title: toastData.message,
          duration: 3000,
        });
        setHasUnsavedChanges(true);
        setPropertyToDelete(null);
        setIsDeletePropertyDialogOpen(false);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSectionId(sectionId);
    // Make the ghost image transparent
    if (e.dataTransfer.setDragImage) {
      const elem = document.getElementById(`section-${sectionId}`);
      if (elem) {
        e.dataTransfer.setDragImage(elem, 20, 20);
      }
    }
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    // Add visual indicator for drop target
    const elem = document.getElementById(`section-${sectionId}`);
    if (elem && draggedSectionId !== sectionId) {
      elem.classList.add("border-primary");
    }
  };

  const handleDragLeave = (e: React.DragEvent, sectionId: string) => {
    // Remove visual indicator
    const elem = document.getElementById(`section-${sectionId}`);
    if (elem) {
      elem.classList.remove("border-primary");
    }
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();

    // Remove visual indicator
    const elem = document.getElementById(`section-${targetSectionId}`);
    if (elem) {
      elem.classList.remove("border-primary");
    }

    if (!draggedSectionId || draggedSectionId === targetSectionId) return;

    const sections = [...page.sections];
    const draggedSectionIndex = sections.findIndex(
      (section) => section.id === draggedSectionId
    );
    const targetSectionIndex = sections.findIndex(
      (section) => section.id === targetSectionId
    );

    if (draggedSectionIndex < 0 || targetSectionIndex < 0) return;

    // Reorder the sections
    const [draggedSection] = sections.splice(draggedSectionIndex, 1);
    sections.splice(targetSectionIndex, 0, draggedSection);

    setPage({
      ...page,
      sections: sections,
    });

    setHasUnsavedChanges(true);
    setDraggedSectionId(null);
  };

  const handleDragEnd = () => {
    setDraggedSectionId(null);

    // Remove any lingering visual indicators
    document.querySelectorAll("[id^='section-']").forEach((elem) => {
      elem.classList.remove("border-primary");
    });
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to a database
    // For new pages, we would create a new entry
    if (isNewPage) {
      toast({
        title: "Page created",
        description: "Your new page has been created successfully.",
        duration: 3000,
      });
      // In a real app, we would redirect to the new page's edit URL
      // For now, we'll just mark it as no longer new
      setPage({
        ...page,
        id: `page-${Date.now()}`, // Generate a unique ID
      });
    } else {
      toast({
        title: "Changes saved",
        description: "All changes have been saved successfully.",
        duration: 3000,
      });
    }
    setHasUnsavedChanges(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/pages">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewPage ? "Create New Page" : pageData?.title}
          </h1>
          <p className="text-muted-foreground">
            {isNewPage ? "Configure your new page" : `/${pageData?.slug}`}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href={`/`} target="_blank">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="sections">
        <TabsList>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="sections" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Sections</h2>
                <Button
                  size="sm"
                  onClick={() => setIsAddSectionDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2 pr-4">
                  {pageData?.sections.map((section: any) => (
                    <div
                      key={section.title}
                      id={`section-${section.title}`}
                      className={`flex items-center justify-between rounded-md border p-3 cursor-pointer transition-colors ${
                        activeSection === section.title
                          ? "border-primary bg-muted"
                          : "hover:bg-muted/50"
                      } ${
                        draggedSectionId === section.title ? "opacity-50" : ""
                      }`}
                      onClick={() => setActiveSection(section.title)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, section.title)}
                      onDragOver={(e) => handleDragOver(e, section.title)}
                      onDragLeave={(e) => handleDragLeave(e, section.title)}
                      onDrop={(e) => handleDrop(e, section.title)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex items-center">
                        <div
                          className="cursor-grab mr-2 text-muted-foreground hover:text-foreground"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSectionToDelete(section.title);
                              setIsDeleteSectionDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="md:col-span-3">
              {activeSection ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{activeSection}</h2>
                    <Button onClick={() => setIsAddPropertyDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Property
                    </Button>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Properties</CardTitle>
                      <CardDescription>
                        Manage the properties for this section
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {propertyData?.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          No properties yet. Add your first property to get
                          started.
                        </div>
                      ) : (
                        <Accordion type="multiple" className="w-full">
                          {propertyData?.map((property: any) => {
                            const editKey = `${activeSection}-${property.title}`;
                            const displayValue =
                              editedPropertyValues[editKey] !== undefined
                                ? editedPropertyValues[editKey]
                                : property.value;

                            return (
                              <AccordionItem
                                key={property.title}
                                value={property.title}
                              >
                                <AccordionTrigger className="hover:no-underline">
                                  <div className="flex items-center">
                                    <span className="font-medium">
                                      {property.title}
                                    </span>
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      {Array.isArray(displayValue)
                                        ? "Array"
                                        : typeof displayValue === "object" &&
                                          displayValue !== null
                                        ? "Object"
                                        : typeof displayValue}
                                    </span>
                                    <span className="ml-2 text-xs text-yellow-500">
                                      {property.value !== displayValue &&
                                        "unsaved"}
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-4 pt-2">
                                    <PropertyEditor
                                      name={property.title}
                                      value={displayValue}
                                      onChange={(newValue) =>
                                        handleUpdateProperty(
                                          activeSection,
                                          property.title,
                                          newValue
                                        )
                                      }
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() =>
                                          handleSaveProperty(
                                            activeSection,
                                            property.title,
                                            displayValue
                                          )
                                        }
                                        disabled={
                                          property.value === displayValue
                                        }
                                      >
                                        <Save className="h-3 w-3 mr-1" />
                                        Save Property
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                          setPropertyToDelete({
                                            sectionTitle: activeSection,
                                            propertyTitle: property.title,
                                          });
                                          setIsDeletePropertyDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Delete Property
                                      </Button>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex h-[calc(100vh-300px)] items-center justify-center rounded-lg border border-dashed">
                  <div className="flex flex-col items-center text-center p-8">
                    <Layers className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No section selected</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select a section from the sidebar or create a new one to
                      get started.
                    </p>
                    <Button onClick={() => setIsAddSectionDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Section
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
              <CardDescription>
                Configure the basic settings for this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={page.title}
                  onChange={(e) => {
                    setPage({ ...page, title: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <Input
                    id="slug"
                    value={page.slug}
                    onChange={(e) => {
                      setPage({ ...page, slug: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={page.description}
                  onChange={(e) => {
                    setPage({ ...page, description: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Section Dialog */}
      <Dialog
        open={isAddSectionDialogOpen}
        onOpenChange={setIsAddSectionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogDescription>
              Create a new section to organize your content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="section-name">Section Name</Label>
              <Input
                id="section-name"
                placeholder="e.g., Hero Section, Features, Testimonials"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddSectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSection}>Add Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Section Dialog */}
      <Dialog
        open={isDeleteSectionDialogOpen}
        onOpenChange={setIsDeleteSectionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this section? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteSectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSection}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Property Dialog */}
      <Dialog
        open={isAddPropertyDialogOpen}
        onOpenChange={setIsAddPropertyDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
            <DialogDescription>
              Add a new property to this section
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="property-name">Property Name</Label>
              <Input
                id="property-name"
                placeholder="e.g., title, description, buttonText"
                value={newPropertyName}
                onChange={(e) => setNewPropertyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-type">Property Type</Label>
              <select
                id="property-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newPropertyType}
                onChange={(e) => setNewPropertyType(e.target.value)}
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="array">Array</option>
                <option value="object">Object</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="file">File</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-value">
                Initial Value
                {newPropertyType === "array" || newPropertyType === "object" ? (
                  <span className="text-xs text-muted-foreground ml-2">
                    (Enter valid JSON)
                  </span>
                ) : null}
              </Label>
              {newPropertyType === "boolean" ? (
                <select
                  id="property-value"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newPropertyValue}
                  onChange={(e) => setNewPropertyValue(e.target.value)}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              ) : (
                <Textarea
                  id="property-value"
                  placeholder={
                    newPropertyType === "array"
                      ? '["item1", "item2", "item3"]'
                      : newPropertyType === "object"
                      ? '{"key1": "value1", "key2": "value2"}'
                      : "Enter value..."
                  }
                  value={newPropertyValue}
                  onChange={(e) => setNewPropertyValue(e.target.value)}
                  rows={
                    newPropertyType === "array" || newPropertyType === "object"
                      ? 4
                      : 2
                  }
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddPropertyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProperty}>Add Property</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Property Dialog */}
      <Dialog
        open={isDeletePropertyDialogOpen}
        onOpenChange={setIsDeletePropertyDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeletePropertyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteProperty}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}

// Property Editor Component
function PropertyEditor({
  name,
  value,
  onChange,
}: {
  name: string;
  value: any;
  onChange: (value: any) => void;
}) {
  // Determine if this is a media property
  const isImage =
    name.toLowerCase().includes("image") ||
    (typeof value === "object" && value !== null && value.type === "image");
  const isVideo =
    name.toLowerCase().includes("video") ||
    (typeof value === "object" && value !== null && value.type === "video");
  const isFile =
    name.toLowerCase().includes("file") ||
    (typeof value === "object" &&
      value !== null &&
      value.url &&
      !isImage &&
      !isVideo);

  // Handle media types
  if (
    isImage ||
    isVideo ||
    isFile ||
    (typeof value === "object" && value !== null && value.url)
  ) {
    const mediaType = isImage ? "image" : isVideo ? "video" : "file";
    return (
      <MediaUpload
        name={name}
        value={value}
        onChange={onChange}
        type={mediaType}
      />
    );
  }

  if (typeof value === "string") {
    return (
      <div className="space-y-2">
        <Label htmlFor={`property-${name}`}>Value (String)</Label>
        <Textarea
          id={`property-${name}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      </div>
    );
  }

  if (typeof value === "number") {
    return (
      <div className="space-y-2">
        <Label htmlFor={`property-${name}`}>Value (Number)</Label>
        <Input
          id={`property-${name}`}
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <div className="space-y-2">
        <Label htmlFor={`property-${name}`}>Value (Boolean)</Label>
        <select
          id={`property-${name}`}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={value.toString()}
          onChange={(e) => onChange(e.target.value === "true")}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        <Label htmlFor={`property-${name}`}>Value (Array)</Label>
        <Textarea
          id={`property-${name}`}
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              if (Array.isArray(parsed)) {
                onChange(parsed);
              }
            } catch (error) {
              // Don't update if invalid JSON
            }
          }}
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          Enter valid JSON array format
        </p>
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div className="space-y-2">
        <Label htmlFor={`property-${name}`}>Value (Object)</Label>
        <Textarea
          id={`property-${name}`}
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              if (
                typeof parsed === "object" &&
                parsed !== null &&
                !Array.isArray(parsed)
              ) {
                onChange(parsed);
              }
            } catch (error) {
              // Don't update if invalid JSON
            }
          }}
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          Enter valid JSON object format
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`property-${name}`}>Value</Label>
      <Input
        id={`property-${name}`}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
