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
  const { name, description, dependent, files, mainFile } = await req.json();
  if (
    !name ||
    !description ||
    !Array.isArray(files) ||
    files.length === 0 ||
    !mainFile ||
    !files.every((f) => f.filename && typeof f.code === "string")
  )
    return NextResponse.json(
      {
        error:
          "Missing or invalid required fields. 'files' must be an array of {filename, code} objects, and 'mainFile' must be specified.",
      },
      { status: 400 }
    );
  // Only allow js, ts, jsx, tsx, css files
  const allowed = [".js", ".ts", ".jsx", ".tsx", ".css"];
  if (!files.every((f) => allowed.some((ext) => f.filename.endsWith(ext)))) {
    return NextResponse.json(
      { error: "Only js, ts, jsx, tsx, css files allowed." },
      { status: 400 }
    );
  }
  // Main file must exist in files
  const main = files.find((f) => f.filename === mainFile);
  if (!main) {
    return NextResponse.json(
      { error: "Main file not found in files." },
      { status: 400 }
    );
  }
  // TODO: Validate main file has default export (Babel parse)
  // Alias is the name, must be unique for this user
  const alias = name.trim().toLowerCase().replace(/\s+/g, "-");
  const exists = await prisma.component.findFirst({
    where: { alias, userId: session.user.id },
  });
  if (exists) {
    return NextResponse.json(
      { error: "Alias already exists" },
      { status: 409 }
    );
  }
  // Create component and files
  const component = await prisma.component.create({
    data: {
      alias,
      userId: session.user.id,
      description,
      dependent,
      mainFile,
      files: {
        create: files.map((f) => ({ filename: f.filename, code: f.code })),
      },
    },
    include: { files: true },
  });
  return NextResponse.json(component);
}
