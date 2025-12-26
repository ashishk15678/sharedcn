"use client";

import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  return (
    <button
      onClick={() => {
        authClient.signOut();
        toast.success("Succesfully signed out");
        redirect("/login");
      }}
      className="relative w-full flex items-center p-2 cursor-pointer rounded-md transition-all duration-200 group text-zinc-600 dark:text-zinc-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-200"
    >
      <div className="flex-shrink-0 w-8 flex items-center justify-center">
        <LogOutIcon size={20} />
      </div>
      <p className="absolute left-10 text-md ">Logout</p>
    </button>
  );
}
