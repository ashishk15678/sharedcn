import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@/../generated/client";

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
  const { name, description, dependent, code } = await req.json();
  if (!name || !description || !code)
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
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
  const component = await prisma.component.create({
    data: {
      alias,
      code,
      userId: session.user.id,
      description,
      dependent,
    },
  });
  return NextResponse.json(component);
}
