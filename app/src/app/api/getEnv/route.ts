import { NextResponse } from "next/server";

export const GET = () => {
  const Google = {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET,
  };
  const Github = {
    id: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET,
  };
  return NextResponse.json({ Google, Github });
};
