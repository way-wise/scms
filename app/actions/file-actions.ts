"use server"

import fs from "fs/promises"
import path from "path"

// Function to delete unnecessary files
export async function deleteFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath)

    // Check if file exists
    try {
      await fs.access(fullPath)
    } catch (error) {
      return { success: false, error: `File not found: ${filePath}` }
    }

    // Delete the file
    await fs.unlink(fullPath)

    return { success: true, message: `File deleted: ${filePath}` }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error)
    return {
      success: false,
      error: (error as Error).message || `Failed to delete file: ${filePath}`,
    }
  }
}

// Function to delete a directory and its contents
export async function deleteDirectory(dirPath: string) {
  try {
    const fullPath = path.join(process.cwd(), dirPath)

    // Check if directory exists
    try {
      await fs.access(fullPath)
    } catch (error) {
      return { success: false, error: `Directory not found: ${dirPath}` }
    }

    // Delete the directory recursively
    await fs.rm(fullPath, { recursive: true, force: true })

    return { success: true, message: `Directory deleted: ${dirPath}` }
  } catch (error) {
    console.error(`Error deleting directory ${dirPath}:`, error)
    return {
      success: false,
      error: (error as Error).message || `Failed to delete directory: ${dirPath}`,
    }
  }
}
