import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "../../prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const id = url.pathname.split("/").filter(Boolean).pop();
  if (!id)
    return NextResponse.json({ error: "No id provided" }, { status: 400 });
  const component = await prisma.component.findUnique({
    where: { id, userId: session.user.id },
  });
  if (!component)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(component);
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const id = url.pathname.split("/").filter(Boolean).pop();
  if (!id)
    return NextResponse.json({ error: "No id provided" }, { status: 400 });
  try {
    await prisma.component.delete({
      where: { id, userId: session.user.id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Not found or unauthorized" },
      { status: 404 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const id = url.pathname.split("/").filter(Boolean).pop();
  if (!id)
    return NextResponse.json({ error: "No id provided" }, { status: 400 });

  const body = await req.json();
  const { files, mainFile, description, type, tags, dependencies, devDependencies, registryDependencies, installCommand, isPublic, name } = body || {};

  const allowed = [".js", ".ts", ".jsx", ".tsx", ".css", ".html", ".json", ".md", ".env"];
  if (!Array.isArray(files) || files.length === 0 || !mainFile) {
    return NextResponse.json(
      { error: "files and mainFile required" },
      { status: 400 },
    );
  }
  if (
    !files.every(
      (f: any) =>
        f.filename &&
        typeof f.code === "string" &&
        (allowed.some((ext) => f.filename.endsWith(ext)) || f.filename.includes("."))
    )
  ) {
    return NextResponse.json(
      { error: "Invalid files or file types" },
      { status: 400 },
    );
  }
  if (!files.find((f: any) => f.filename === mainFile)) {
    return NextResponse.json(
      { error: "mainFile not present in files" },
      { status: 400 },
    );
  }

  const component = await prisma.component.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!component)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Update component metadata with new schema fields
  await prisma.component.update({
    where: { id },
    data: {
      mainFile,
      description: description ?? component.description,
      type: type ?? component.type,
      tags: tags ?? component.tags,
      dependencies: dependencies ?? component.dependencies,
      devDependencies: devDependencies ?? component.devDependencies,
      registryDependencies: registryDependencies ?? component.registryDependencies,
      installCommand: installCommand !== undefined ? installCommand : component.installCommand,
      isPublic: isPublic ?? component.isPublic,
    },
  });

  // Replace files: delete then create
  await prisma.file.deleteMany({ where: { componentId: id } });
  await prisma.file.createMany({
    data: files.map((f: any) => ({
      componentId: id,
      filename: f.filename,
      code: f.code,
    })),
  });

  const updated = await prisma.component.findUnique({
    where: { id },
    include: { files: true, metrics: true },
  });

  return NextResponse.json(updated);
}
