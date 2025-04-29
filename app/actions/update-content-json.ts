"use server"

import fs from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"
import type { PageContent } from "@/lib/content"

export async function updateContentJson(pageId: string, content: PageContent) {
  try {
    console.log(`Starting JSON content update for page: ${pageId}`)

    // Create the content directory if it doesn't exist
    const contentDir = path.join(process.cwd(), "content")
    try {
      await fs.mkdir(contentDir, { recursive: true })
    } catch (error) {
      console.error(`Error creating content directory: ${error}`)
    }

    // Write the content to a JSON file
    const contentFilePath = path.join(contentDir, `${pageId}.json`)
    await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), "utf8")
    console.log(`Successfully wrote JSON content to: ${contentFilePath}`)

    // Revalidate paths
    revalidatePath("/")
    revalidatePath(`/${pageId}`)
    console.log("Revalidated paths")

    return {
      success: true,
      message: "Content saved to JSON file",
      path: contentFilePath,
    }
  } catch (error) {
    console.error("Error in updateContentJson:", error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}
