import fs from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";

const jsonFilePath = path.join(process.cwd(), "maindb.json");
export function getDb() {
  const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
  const data = JSON.parse(fileContent);
  return data;
}
export function setDb(data: any) {
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  const data = getDb();
  return NextResponse.json(data.pages);
}

export async function POST(request: NextRequest) {
  const newPage = await request.json();
  try {
    const data = getDb();

    const isPageExists = data.pages.find(
      (page: any) => page.slug === newPage.slug
    );

    if (isPageExists) {
      return NextResponse.json(
        { success: false, message: "Page already exists" },
        { status: 400 }
      );
    }

    // Add new page to the list
    data.pages.push(newPage);

    // Write back to the file
    setDb(data);
    return NextResponse.json({
      success: true,
      message: "Page added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to write file", error: error },
      { status: 500 }
    );
  }
}
