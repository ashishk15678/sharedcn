import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma";
import { auth } from "@/lib/auth";

// TODO : Set prisma as global instance , probably use cursor for this

export async function GET(req: NextRequest) {
  try {
    // auth check
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // finding user in db
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // user not in db
    if (!user) {
      return NextResponse.json({
        sucess: false,
        msg: "User not in db ",
        username: "",
      });
    }

    // user exists but username not set
    if (!user.username) {
      return NextResponse.json({
        sucess: true,
        msg: "Username not set ",
        username: "",
      });
    }

    // finally returning username
    return NextResponse.json({
      sucess: true,
      msg: "Username set ",
      username: user?.username,
    });
  } catch (c) {
    console.error("GET `/api/username` : ERROR => ", c);
    return NextResponse.json(
      {
        success: false,
        msg: "Some unknown error occured",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // auth check
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // checking if the user already has username or not
    const usernameExists = await prisma.user.findUnique({
      where: { id: session.user?.id },
    });

    if (usernameExists?.username) {
      return NextResponse.json({
        success: false,
        msg: "Username already exists",
      });
    }

    // getting username from frontend
    const { username } = await req.json();
    if (!username || username.length < 3)
      return NextResponse.json(
        { error: "Username too short" },
        { status: 400 }
      );
    const normalized = username.trim().toLowerCase();

    // checking for username in db one finaly time
    const exists = await prisma.user.findFirst({
      where: { username: normalized },
    });
    if (exists)
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );

    // updating db with new username
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { username: normalized },
    });
    return NextResponse.json(user);
  } catch (c) {
    console.error("ERROR at `/api/username` at POST : ", c);
    return NextResponse.json(
      { success: false, msg: "Some error occured" },
      { status: 500 }
    );
  }
}
