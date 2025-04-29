import { NextRequest, NextResponse } from "next/server";
import { getDb, setDb } from "../../route";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("slug");
  const sectionTitle = searchParams.get("sectionTitle");
  const propertyTitle = searchParams.get("propertyTitle");
  console.log("pageSlug", pageSlug);
  console.log("sectionTitle", sectionTitle);
  console.log("propertyTitle", propertyTitle);

  const data = getDb();
  const page = data.pages.find((page: any) => page.slug === pageSlug);
  const section = page.sections.find(
    (section: any) => section.title === sectionTitle
  );

  return NextResponse.json(section.properties);
}

export async function POST(request: NextRequest) {
  // body data
  const newProperty = await request.json();

  // query params
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("slug");
  const sectionTitle = searchParams.get("sectionTitle");
  const propertyTitle = searchParams.get("propertyTitle");

  const data = getDb();
  const page = data.pages.find((page: any) => page.slug === pageSlug);
  const section = page.sections.find(
    (section: any) => section.title === sectionTitle
  );

  const property = section.properties.find(
    (property: any) => property.title === propertyTitle
  );
  if (property) {
    return NextResponse.json({
      success: false,
      message: "Property already exists",
    });
  }

  section.properties.push(newProperty);

  setDb(data);
  return NextResponse.json({
    success: true,
    message: "Property created successfully",
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("slug");
  const sectionTitle = searchParams.get("sectionTitle");
  const propertyTitle = searchParams.get("propertyTitle");

  const data = getDb();
  const page = data.pages.find((page: any) => page.slug === pageSlug);
  const section = page.sections.find(
    (section: any) => section.title === sectionTitle
  );
  const property = section.properties.find(
    (property: any) => property.title === propertyTitle
  );
  if (!property) {
    return NextResponse.json({
      success: false,
      message: "Property not found",
    });
  }
  section.properties = section.properties.filter(
    (property: any) => property.title !== propertyTitle
  );

  setDb(data);
  return NextResponse.json({
    success: true,
    message: "Property deleted successfully",
  });
}

export async function PATCH(request: NextRequest) {
  // body data
  const updatableProperty = await request.json();
  console.log("updatableProperty", updatableProperty);

  // query params
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("slug");
  const sectionTitle = searchParams.get("sectionTitle");
  const propertyTitle = searchParams.get("propertyTitle");

  const data = getDb();
  const page = data.pages.find((page: any) => page.slug === pageSlug);
  const section = page.sections.find(
    (section: any) => section.title === sectionTitle
  );
  const property = section.properties.find(
    (property: any) => property.title === propertyTitle
  );
  if (!property) {
    return NextResponse.json({
      success: false,
      message: "Property not found",
    });
  }

  const updatedProperty = { ...property, ...updatableProperty };
  section.properties = section.properties.map((property: any) =>
    property.title === propertyTitle ? updatedProperty : property
  );

  setDb(data);
  return NextResponse.json({
    success: true,
    message: "Property updated successfully",
  });
}
