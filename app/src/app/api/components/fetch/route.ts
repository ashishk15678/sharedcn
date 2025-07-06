import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/../generated/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body must be an array of aliases." },
      { status: 400, headers: corsHeaders }
    );
  }
  const aliases = body.filter((a) => typeof a === "string");
  if (aliases.length === 0) {
    return NextResponse.json(
      { error: "No valid aliases provided." },
      { status: 400, headers: corsHeaders }
    );
  }
  // Fetch all components by alias
  const components = await prisma.component.findMany({
    where: { alias: { in: aliases } },
  });
  // Map to alias -> component
  const compMap = new Map();
  for (const comp of components) compMap.set(comp.alias, comp);
  // Build response array in same order as input
  const result = aliases.map((alias) => {
    if (compMap.has(alias)) {
      const comp = compMap.get(alias);
      // Parse dependents if stored as JSON string
      let dependent = comp.dependent;
      if (typeof dependent === "string") {
        try {
          dependent = JSON.parse(dependent);
        } catch {}
      }
      return { ...comp, dependent };
    }
    return { alias, error: "doesnot exist" };
  });
  prisma.$disconnect();
  return NextResponse.json(result, { status: 200, headers: corsHeaders });
}
