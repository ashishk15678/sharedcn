import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { headers } from "next/headers";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  // CORS headers
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

  // Validate input
  const { name, description, dependent, code, token } = body;
  if (name === "token-validation") {
    // Accept token from body, not header
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    const user = await prisma.user.findUnique({ where: { authToken: token } });
    if (user) {
      return NextResponse.json(
        { valid: true },
        { status: 200, headers: corsHeaders }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401, headers: corsHeaders }
      );
    }
  }

  // If body is an array, treat as fetch-by-aliases
  if (Array.isArray(body)) {
    // Accepts array of aliases (strings)
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
      if (compMap.has(alias)) return compMap.get(alias);
      return { alias, error: "doesnot exist" };
    });
    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  }

  if (
    !name ||
    typeof name !== "string" ||
    !Array.isArray(dependent) ||
    !dependent.every((d) => typeof d === "string") ||
    !Array.isArray(code) ||
    !code.every(
      (f) =>
        typeof f === "object" &&
        typeof f.filename === "string" &&
        typeof f.code === "string"
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid or missing fields. Required: name (string), dependent (array of strings), code (array of {filename, code} objects). Optional: description (string)",
      },
      { status: 400, headers: corsHeaders }
    );
  }

  // Get token from Authorization header
  const authHeader = (await headers()).get("authorization") || "";

  let user = null;
  if (token) {
    user = await prisma.user.findUnique({ where: { authToken: token } });
  }

  // Fallback to public user if not found
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: "public@ashish.services" },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "public@ashish.services",
          name: "Public User",
          emailVerified: false,
          username: "public",
        },
      });
    }
  }

  // Use username for alias prefix if available
  let username = user.username || "public";
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "-");
  const fullAlias = `@${username}/${normalized}`;

  // Check if alias is already taken
  let component = await prisma.component.findFirst({
    where: { alias: fullAlias },
  });

  if (component) {
    return NextResponse.json(
      { error: `Alias '${fullAlias}' is already taken.` },
      { status: 409, headers: corsHeaders }
    );
  }

  // Create the new component
  component = await prisma.component.create({
    data: {
      alias: fullAlias,
      description: description || "",
      dependent: JSON.stringify(dependent),
      code,
      userId: user.id,
    },
  });
  return NextResponse.json(component, { status: 201, headers: corsHeaders });
}
