import { deleteFile, deleteDirectory } from "../app/actions/file-actions"

// List of files to delete
const filesToDelete = [
  "lib/content.ts",
  "lib/content-loader.ts",
  "lib/load-content.ts",
  "app/actions/update-content.ts",
  "app/actions/update-content-file.ts",
  "app/actions/update-content-json.ts",
  "app/actions/write-content.ts",
]

// List of directories to delete
const directoriesToDelete = ["content"]

async function cleanup() {
  console.log("Starting cleanup process...")

  // Delete files
  for (const file of filesToDelete) {
    const result = await deleteFile(file)
    if (result.success) {
      console.log(result.message)
    } else {
      console.warn(result.error)
    }
  }

  // Delete directories
  for (const dir of directoriesToDelete) {
    const result = await deleteDirectory(dir)
    if (result.success) {
      console.log(result.message)
    } else {
      console.warn(result.error)
    }
  }

  console.log("Cleanup process completed.")
}

// Run the cleanup
cleanup().catch(console.error)
