import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "../../../../../generated/client";

export async function GET() {
  const client = new PrismaClient();
  const data = await client.component.findMany({});
  client.$disconnect();
  return NextResponse.json(data);
}
