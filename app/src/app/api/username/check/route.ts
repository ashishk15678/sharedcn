import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    if (!username || username.length < 3)
      return NextResponse.json({ available: false }, { status: 400 });
    const normalized = username.trim().toLowerCase();
    const exists = await prisma.user.findFirst({
      where: { username: normalized },
    });
    return NextResponse.json({ available: !exists });
  } catch (c) {
    console.error("`/api/username/check` at GET : ", c);
  }
  return NextResponse.json({ msg: "Some error occured" }, { status: 500 });
}
