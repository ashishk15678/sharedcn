import { NextResponse } from "next/server";
import { prisma } from "../../prisma";

export async function GET() {
  const data = await prisma.component.findMany({});
  return NextResponse.json(data);
}
