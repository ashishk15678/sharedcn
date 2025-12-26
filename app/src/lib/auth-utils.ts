"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  const header = await headers();
  const session = await auth.api.getSession({ headers: header });
  if (!session) redirect("/login?msg=Please+sign+in+to+continue");
  return session;
};

export const requireUnAuth = async () => {
  const header = await headers();
  const session = await auth.api.getSession({ headers: header });
  if (session) redirect("/dashboard?msg=You+are+already+signed+in");
  return session;
};
