"use server"

import { revalidatePath } from "next/cache"
import { getPageContent, updatePageContent } from "@/lib/data-service"
import type { PageContent } from "@/types/content"

// Action to get page content
export async function fetchPageContent(pageId: string) {
  try {
    const content = await getPageContent(pageId)
    return { success: true, data: content }
  } catch (error) {
    console.error(`Error fetching page ${pageId}:`, error)
    return {
      success: false,
      error: (error as Error).message || `Failed to fetch page ${pageId}`,
    }
  }
}

// Action to update page content
export async function savePageContent(pageId: string, content: PageContent) {
  try {
    await updatePageContent(pageId, content)

    // Revalidate paths to refresh the content
    revalidatePath("/")
    revalidatePath(`/${pageId}`)
    revalidatePath("/dashboard/content")

    return {
      success: true,
      message: "Content updated successfully",
    }
  } catch (error) {
    console.error(`Error saving page ${pageId}:`, error)
    return {
      success: false,
      error: (error as Error).message || `Failed to save page ${pageId}`,
    }
  }
}

// Action to update a specific section of a page
export async function updatePageSection(pageId: string, sectionKey: keyof PageContent, sectionData: any) {
  try {
    // Get the current page content
    const pageContent = await getPageContent(pageId)

    // Update the specific section
    const updatedContent = {
      ...pageContent,
      [sectionKey]: sectionData,
    }

    // Save the updated content
    await updatePageContent(pageId, updatedContent)

    // Revalidate paths
    revalidatePath("/")
    revalidatePath(`/${pageId}`)
    revalidatePath("/dashboard/content")

    return {
      success: true,
      message: `${sectionKey} section updated successfully`,
    }
  } catch (error) {
    console.error(`Error updating ${sectionKey} section for page ${pageId}:`, error)
    return {
      success: false,
      error: (error as Error).message || `Failed to update ${sectionKey} section`,
    }
  }
}
