import { NextResponse } from "next/server"
import { getPageContent, updatePageContent } from "@/lib/data-service"

// GET handler to retrieve content
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pageId = searchParams.get("pageId") || "home"

  try {
    const content = await getPageContent(pageId)
    return NextResponse.json(content)
  } catch (error) {
    console.error(`Error getting page ${pageId}:`, error)
    return NextResponse.json({ error: `Page ${pageId} not found or could not be loaded` }, { status: 404 })
  }
}

// POST handler to update content
export async function POST(request: Request) {
  try {
    const { pageId, content } = await request.json()

    if (!pageId || !content) {
      return NextResponse.json({ error: "Missing pageId or content" }, { status: 400 })
    }

    console.log(`Received content update request for page: ${pageId}`)

    // Update the content using our data service
    await updatePageContent(pageId, content)

    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
    })
  } catch (error) {
    console.error("Error in POST handler:", error)
    return NextResponse.json(
      {
        error: "Server error processing content update",
        details: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
