import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const components = await prisma.component.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(components);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { alias, code } = await req.json();
  if (!alias || !code)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  try {
    const component = await prisma.component.create({
      data: {
        alias,
        code,
        userId: session.user.id,
      },
    });
    return NextResponse.json(component);
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: "Alias must be unique" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
