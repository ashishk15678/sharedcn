import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { headers } from "next/headers";

// Security: Define allowed origins from environment or use a restrictive default
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

function getCorsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(req: NextRequest) {
  // Security: Get CORS headers based on origin
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400, headers: corsHeaders },
    );
  }

  // Validate input - accept new schema fields
  const { name, description, type, tags, dependencies, devDependencies, registryDependencies, installCommand, code, token } = body;
  if (name === "token-validation") {
    // Accept token from body, not header
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400, headers: corsHeaders },
      );
    }
    const user = await prisma.user.findUnique({ where: { authToken: token } });
    if (user) {
      return NextResponse.json(
        { valid: true },
        { status: 200, headers: corsHeaders },
      );
    } else {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401, headers: corsHeaders },
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
        { status: 400, headers: corsHeaders },
      );
    }
    // Fetch all components by alias
    const components = await prisma.component.findMany({
      where: { alias: { in: aliases } },
      include: { files: true },
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
    !Array.isArray(code) ||
    !code.every(
      (f) =>
        typeof f === "object" &&
        typeof f.filename === "string" &&
        typeof f.code === "string",
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid or missing fields. Required: name (string), code (array of {filename, code} objects). Optional: description, type, tags, dependencies, devDependencies, registryDependencies, installCommand",
      },
      { status: 400, headers: corsHeaders },
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
    const PUBLIC_USER_EMAIL = process.env.PUBLIC_USER_EMAIL || "public@ashish.services";
    const PUBLIC_USERNAME = process.env.PUBLIC_USERNAME || "public";
    
    user = await prisma.user.findUnique({
      where: { email: PUBLIC_USER_EMAIL },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: PUBLIC_USER_EMAIL,
          name: "Public User",
          emailVerified: false,
          username: PUBLIC_USERNAME,
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
      { status: 409, headers: corsHeaders },
    );
  }

  // Security: Validate file extensions
  const componentAllowed = [".js", ".ts", ".jsx", ".tsx", ".css", ".html"];
  const setupAllowed = [".js", ".ts", ".jsx", ".tsx", ".css", ".html", ".json", ".md", ".env", ".yml", ".yaml", ".toml", ".prisma"];
  const allowed = type === "setup" ? setupAllowed : componentAllowed;
  
  if (!code.every((f: any) => allowed.some((ext) => f.filename.toLowerCase().endsWith(ext)))) {
    return NextResponse.json(
      { error: `Invalid file types. Allowed extensions: ${allowed.join(", ")}` },
      { status: 400, headers: corsHeaders },
    );
  }

  // Security: Validate file sizes (prevent DOS)
  const MAX_FILE_SIZE = 500000; // 500KB per file
  if (code.some((f: any) => f.code.length > MAX_FILE_SIZE)) {
    return NextResponse.json(
      { error: "File size too large. Maximum 500KB per file." },
      { status: 400, headers: corsHeaders },
    );
  }

  // Create the new component with new schema fields
  component = await prisma.component.create({
    data: {
      alias: fullAlias,
      description: description || "",
      type: type || "component",
      tags: tags || [],
      dependencies: dependencies || [],
      devDependencies: devDependencies || [],
      registryDependencies: registryDependencies || [],
      installCommand: installCommand || null,
      isPublic: true,
      mainFile: code[0]?.filename || "index.tsx",
      userId: user.id,
      files: {
        create: code.map((f: { filename: string; code: string }) => ({
          filename: f.filename,
          code: f.code,
        })),
      },
    },
    include: { files: true },
  });
  return NextResponse.json(component, { status: 201, headers: corsHeaders });
}
