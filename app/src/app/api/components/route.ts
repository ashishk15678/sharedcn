import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "../prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const components = await prisma.component.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      metrics: true,
      files: true,
    },
  });
  return NextResponse.json(components);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, description, type, tags, dependencies, devDependencies, registryDependencies, installCommand, isPublic, files, mainFile } = await req.json();
  if (
    !name ||
    !description ||
    !Array.isArray(files) ||
    files.length === 0 ||
    !mainFile ||
    !files.every((f: any) => f.filename && typeof f.code === "string")
  )
    return NextResponse.json(
      {
        error:
          "Missing or invalid required fields. 'files' must be an array of {filename, code} objects, and 'mainFile' must be specified.",
      },
      { status: 400 }
    );
  
  // Allow more file types for setups
  const isSetup = type === "setup";
  const componentAllowed = [".js", ".ts", ".jsx", ".tsx", ".css", ".html"];
  const setupAllowed = [".js", ".ts", ".jsx", ".tsx", ".css", ".html", ".json", ".md", ".env", ".yml", ".yaml", ".toml", ".prisma"];
  const allowed = isSetup ? setupAllowed : componentAllowed;
  
  if (!files.every((f: any) => allowed.some((ext) => f.filename.endsWith(ext)) || f.filename.includes("."))) {
    return NextResponse.json(
      { error: `Invalid file types for ${isSetup ? 'setup' : 'component'}.` },
      { status: 400 }
    );
  }
  
  // Main file must exist in files
  const main = files.find((f: any) => f.filename === mainFile);
  if (!main) {
    return NextResponse.json(
      { error: "Main file not found in files." },
      { status: 400 }
    );
  }
  
  // Get username for alias
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true },
  });
  const username = user?.username || "user";
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "-");
  const alias = `@${username}/${normalized}`;
  
  const exists = await prisma.component.findFirst({
    where: { alias },
  });
  if (exists) {
    return NextResponse.json(
      { error: "Alias already exists" },
      { status: 409 }
    );
  }
  
  // Create component and files with new schema
  const component = await prisma.component.create({
    data: {
      alias,
      userId: session.user.id,
      description,
      type: type || "component",
      tags: tags || [],
      dependencies: dependencies || [],
      devDependencies: devDependencies || [],
      registryDependencies: registryDependencies || [],
      installCommand: installCommand || null,
      isPublic: isPublic !== false,
      mainFile,
      files: {
        create: files.map((f: any) => ({ filename: f.filename, code: f.code })),
      },
    },
    include: { files: true },
  });
  return NextResponse.json(component);
}
