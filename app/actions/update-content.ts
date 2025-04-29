"use server"

import fs from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"
import type { PageContent } from "@/lib/content"

export async function updateContent(pageId: string, content: PageContent) {
  try {
    // Get the current content from the file
    const contentFilePath = path.join(process.cwd(), "lib", "content.ts")

    // First, check if the file exists
    try {
      await fs.access(contentFilePath)
    } catch (error) {
      console.error("File not found:", contentFilePath)
      return { success: false, error: `Content file not found at ${contentFilePath}` }
    }

    const fileContent = await fs.readFile(contentFilePath, "utf8")

    // Log the first few characters of the file for debugging
    console.log("File content preview:", fileContent.substring(0, 200))

    // Try different regex patterns to find the mockContent object
    let mockContentMatch = fileContent.match(
      /const\s+mockContent\s*:\s*Record<string,\s*PageContent>\s*=\s*({[\s\S]*?});/,
    )

    // If not found, try a more flexible pattern
    if (!mockContentMatch) {
      mockContentMatch = fileContent.match(/const\s+mockContent\s*=\s*({[\s\S]*?});/)
    }

    // If still not found, try an even more flexible pattern
    if (!mockContentMatch) {
      mockContentMatch = fileContent.match(/mockContent\s*=\s*({[\s\S]*?});/)
    }

    if (!mockContentMatch) {
      // If we still can't find it, let's create a new content.ts file with our content
      const newContentFile = `
import { cache } from "react"

// Define types for our content
export type PageContent = {
  header: {
    logo: string
    navigation: Array<{ label: string; url: string; children?: Array<{ label: string; url: string }> }>
    ctaButton: { label: string; url: string }
  }
  hero: {
    title: string
    description: string
    rating: number
    image: string
    ctaButton: { label: string; url: string }
  }
  stats: Array<{
    value: string
    label: string
    description?: string
  }>
  partners: {
    title: string
    logos: Array<{ name: string; logo: string; url?: string }>
  }
  features: {
    title: string
    description: string
    image: string
    sidebar: Array<{ title: string; isActive?: boolean }>
    items: Array<{
      title: string
      description: string
      image?: string
    }>
  }
  integrations: {
    title: string
    description: string
    logos: Array<{ name: string; logo: string }>
  }
  benefits: Array<{
    title: string
    image: string
    items: Array<{ text: string }>
  }>
  testimonials: {
    title: string
    items: Array<{
      quote: string
      author: {
        name: string
        title: string
        company: string
        avatar: string
      }
      rating: number
    }>
  }
  contact: {
    title: string
    description: string
    email: string
    mapImage: string
    ctaButton: { label: string; url: string }
  }
  footer: {
    links: Array<{ label: string; url: string }>
    copyright: string
  }
}

// Mock data based on the image
const mockContent: Record<string, PageContent> = {
  ${pageId}: ${JSON.stringify(content, null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"/g, "'")}
}

// Function to get content for a specific page
export const getPageContent = cache(async (pageId: string): Promise<PageContent> => {
  // In a real implementation, this would fetch from an API
  // For now, we'll use the mock data
  const content = mockContent[pageId] || mockContent["home"]

  // Ensure all required properties exist to prevent undefined errors
  return {
    header: content.header || {
      logo: "/logo.svg",
      navigation: [],
      ctaButton: { label: "Get started", url: "/get-started" },
    },
    hero: content.hero || {
      title: "Default Title",
      description: "Default description",
      rating: 5,
      image: "/placeholder.svg",
      ctaButton: { label: "Get started", url: "/get-started" },
    },
    stats: content.stats || [],
    partners: content.partners || { title: "Partners", logos: [] },
    features: content.features || {
      title: "Features",
      description: "Our features",
      image: "/placeholder.svg",
      sidebar: [],
      items: [],
    },
    integrations: content.integrations || {
      title: "Integrations",
      description: "",
      logos: [],
    },
    benefits: content.benefits || [],
    testimonials: content.testimonials || { title: "Testimonials", items: [] },
    contact: content.contact || {
      title: "Contact Us",
      description: "",
      email: "info@example.com",
      mapImage: "/placeholder.svg",
      ctaButton: { label: "Contact", url: "/contact" },
    },
    footer: content.footer || {
      links: [],
      copyright: "© 2023",
    },
  }
})
`

      // Write the new content file
      await fs.writeFile(contentFilePath, newContentFile, "utf8")

      // Revalidate paths
      revalidatePath("/")
      revalidatePath(`/${pageId}`)

      return { success: true, message: "Created new content.ts file with your content" }
    }

    // Extract the mockContent object
    const mockContentString = mockContentMatch[1]

    // Create a new mockContent object with the updated content
    let updatedMockContent = mockContentString

    // Check if the pageId already exists in the mockContent
    const pageRegex = new RegExp(`['"]${pageId}['"]\\s*:\\s*({[\\s\\S]*?}),?\\s*['"]`, "g")
    const pageMatch = pageRegex.exec(mockContentString)

    if (pageMatch) {
      // Replace the existing page content
      const stringifiedContent = JSON.stringify(content, null, 2)
        .replace(/"([^"]+)":/g, "$1:") // Convert "key": to key:
        .replace(/"/g, "'") // Replace double quotes with single quotes

      updatedMockContent = mockContentString.replace(pageRegex, `'${pageId}': ${stringifiedContent},\n  '`)
    } else {
      // Add new page content
      const stringifiedContent = JSON.stringify(content, null, 2)
        .replace(/"([^"]+)":/g, "$1:") // Convert "key": to key:
        .replace(/"/g, "'") // Replace double quotes with single quotes

      // Check if the mockContent object is empty
      if (mockContentString.trim() === "{") {
        updatedMockContent = mockContentString.replace("{", `{\n  '${pageId}': ${stringifiedContent}\n`)
      } else {
        updatedMockContent = mockContentString.replace("{", `{\n  '${pageId}': ${stringifiedContent},`)
      }
    }

    // Replace the mockContent in the file
    const updatedFileContent = fileContent.replace(
      mockContentMatch[0],
      `const mockContent: Record<string, PageContent> = ${updatedMockContent};`,
    )

    // Write the updated content back to the file
    await fs.writeFile(contentFilePath, updatedFileContent, "utf8")

    // Revalidate the path to reflect changes
    revalidatePath("/")
    revalidatePath(`/${pageId}`)

    return { success: true }
  } catch (error) {
    console.error("Error updating content:", error)
    return { success: false, error: (error as Error).message }
  }
}
