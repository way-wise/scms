import { NextRequest, NextResponse } from "next/server";
import { getDb, setDb } from "../route";

export async function GET(request: NextRequest) {
  // query params
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("slug");
  const sectionTitle = searchParams.get("sectionTitle");

  const data = getDb();
  const page = data.pages.find((page: any) => page.slug === pageSlug);
  const section = page.sections.find(
    (section: any) => section.title === sectionTitle
  );
  return NextResponse.json(section);
}

export async function POST(request: NextRequest) {
  // body data
  const newSection = await request.json();

  // query params
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("slug");
  const sectionTitle = searchParams.get("sectionTitle");

  const data = getDb();
  let page = data.pages.find((page: any) => page.slug === pageSlug);
  if (!page) {
    return NextResponse.json({
      success: false,
      message: "Page not found",
    });
  }
  const section = page.sections.find(
    (section: any) => section.title === sectionTitle
  );
  if (section) {
    return NextResponse.json({
      success: false,
      message: "Section already exists",
    });
  }
  page.sections.push(newSection);

  setDb(data);
  return NextResponse.json({
    success: true,
    message: "Section added successfully",
  });
}

export async function DELETE(request: NextRequest) {
  // query params
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("slug");
  const sectionTitle = searchParams.get("sectionTitle");

  const data = getDb();
  let page = data.pages.find((page: any) => page.slug === pageSlug);
  if (!page) {
    return NextResponse.json({
      success: false,
      message: "Page not found",
    });
  }
  page.sections = page.sections.filter(
    (section: any) => section.title !== sectionTitle
  );
  setDb(data);
  return NextResponse.json({
    success: true,
    message: "Section deleted successfully",
  });
}
