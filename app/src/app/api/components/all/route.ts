import { NextResponse } from "next/server";
import { prisma } from "../../prisma";

export async function GET() {
  const data = await prisma.component.findMany({
    include: {
      metrics: true,
      files: true,
    },
  });
  return NextResponse.json(data);
}
