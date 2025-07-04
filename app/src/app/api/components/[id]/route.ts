import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@/../generated/client";

const prisma = new PrismaClient();

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
      { status: 404 }
    );
  }
}
