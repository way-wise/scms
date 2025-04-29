"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

// Path to the db.json file
const DB_PATH = path.join(process.cwd(), "db.json");

// Type for the entire database
export interface Database {
  pages: Record<string, any>;
  settings: {
    siteName: string;
    siteUrl: string;
    apiKey: string;
    enablePreview: boolean;
    enableVersioning: boolean;
  };
}

// Function to read the entire database
export async function readDatabase(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data) as Database;
  } catch (error) {
    console.error("Error reading database:", error);
    throw new Error("Failed to read database");
  }
}

// Function to write the entire database
export async function writeDatabase(data: Database): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database:", error);
    throw new Error("Failed to write database");
  }
}

// Function to get a page's content
export async function getPageContent(pageId: string): Promise<any> {
  try {
    const db = await readDatabase();
    const pageContent = db.pages[pageId];

    if (!pageContent) {
      throw new Error(`Page ${pageId} not found`);
    }

    return pageContent;
  } catch (error) {
    console.error(`Error getting page ${pageId}:`, error);
    throw new Error(`Failed to get page ${pageId}`);
  }
}

// Function to update a page's content
export async function updatePageContent(
  pageId: string,
  content: any
): Promise<void> {
  try {
    const db = await readDatabase();

    // Update the page content
    db.pages[pageId] = content;

    // Write the updated database back to the file
    await writeDatabase(db);

    // Revalidate paths to refresh the content
    revalidatePath("/");
    revalidatePath(`/${pageId}`);
    revalidatePath("/dashboard/content");
  } catch (error) {
    console.error(`Error updating page ${pageId}:`, error);
    throw new Error(`Failed to update page ${pageId}`);
  }
}

// Function to get settings
export async function getSettings(): Promise<Database["settings"]> {
  try {
    const db = await readDatabase();
    return db.settings;
  } catch (error) {
    console.error("Error getting settings:", error);
    throw new Error("Failed to get settings");
  }
}

// Function to update settings
export async function updateSettings(
  settings: Database["settings"]
): Promise<void> {
  try {
    const db = await readDatabase();

    // Update settings
    db.settings = settings;

    // Write the updated database back to the file
    await writeDatabase(db);

    // Revalidate paths
    revalidatePath("/dashboard/settings");
  } catch (error) {
    console.error("Error updating settings:", error);
    throw new Error("Failed to update settings");
  }
}
