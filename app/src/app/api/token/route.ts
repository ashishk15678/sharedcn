import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await auth.api.getSession({ headers: req.headers });
    if (!user) {
      return NextResponse.json(
        { success: false, msg: "unauthorized" },
        { status: 401 }
      );
    }
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.user.id,
      },
    });

    if (!dbUser) {
      return NextResponse.json({
        success: false,
        msg: "Could not find user in db",
      });
    }

    if (dbUser.authToken) {
      return NextResponse.json({ success: true, token: dbUser.authToken });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.user.id,
      },
      data: {
        authToken: crypto.randomUUID(),
      },
    });
    return NextResponse.json({
      success: true,
      token: (await updatedUser).authToken,
    });
  } catch (c) {
    console.error("ERROR at token `/api/token` : ", c);
    return NextResponse.json(
      {
        sucess: false,
        msg: "Some unknown error occured",
      },
      { status: 500 }
    );
  }
}
