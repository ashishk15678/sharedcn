import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  // Return all feedbacks, anonymizing if needed
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, image: true, id: true } } },
  });
  return NextResponse.json(
    feedbacks.map((fb: any) => ({
      ...fb,
      user: fb.isAnonymous ? null : fb.user,
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  const { content, rating, isAnonymous } = await req.json();
  if (!content || typeof rating !== "number" || rating < 1 || rating > 4) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (!session && !isAnonymous) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const feedback = await prisma.feedback.create({
    data: {
      content,
      rating,
      isAnonymous: !!isAnonymous,
      userId: !isAnonymous && session?.user?.id ? session.user.id : null,
    },
  });
  return NextResponse.json(feedback);
}
