import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@/../generated/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ available: false }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const alias = searchParams.get("alias");
  if (!alias) return NextResponse.json({ available: false }, { status: 400 });
  const normalized = alias.trim().toLowerCase().replace(/\s+/g, "-");
  const exists = await prisma.component.findFirst({
    where: { alias: normalized, userId: session.user.id },
  });
  return NextResponse.json({ available: !exists });
}
