import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const component = await prisma.component.findUnique({
    where: { id: params.id, userId: session.user.id },
  });
  if (!component)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(component);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.component.delete({
      where: { id: params.id, userId: session.user.id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Not found or unauthorized" },
      { status: 404 }
    );
  }
}
