import fs from "fs/promises"
import path from "path"
import { cache } from "react"
import type { PageContent } from "./content"

// Function to load content from JSON files
export const loadContentFromJson = cache(async (pageId: string): Promise<PageContent | null> => {
  try {
    const contentDir = path.join(process.cwd(), "content")
    const contentFilePath = path.join(contentDir, `${pageId}.json`)

    // Check if the file exists
    try {
      await fs.access(contentFilePath)
    } catch (error) {
      console.log(`JSON content file not found for page: ${pageId}`)
      return null
    }

    // Read and parse the JSON file
    const fileContent = await fs.readFile(contentFilePath, "utf8")
    return JSON.parse(fileContent) as PageContent
  } catch (error) {
    console.error(`Error loading content from JSON for page ${pageId}:`, error)
    return null
  }
})
