import { NextRequest, NextResponse } from "next/server";
import { getDb, setDb } from "../route";

export function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const data = getDb();
  const page = data.pages.find((page: any) => page.slug === slug);
  return NextResponse.json(page);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const data = getDb();
  const page = data.pages.find((page: any) => page.slug === slug);
  return NextResponse.json(page);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  let data = getDb();
  data.pages = data.pages.filter((page: any) => page.slug !== slug);

  setDb(data);
  return NextResponse.json({ message: "Page deleted successfully" });
}
