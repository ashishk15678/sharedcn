"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { PiGithubLogoLight } from "react-icons/pi";

export default function SignInPage() {
  return (
    <div className="h-screen w-full  bg-gradient-to-b from-white via-white to-zinc-300 flex items-center justify-center">
      <div className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-200 p-8 rounded-2xl shadow-lg flex flex-col items-center gap-6 border-2 border-zinc-100">
        <h1 className="text-2xl text-zinc-700 font-bold mb-2">
          Continue to Icons
        </h1>
        <button
          className="w-64 py-1 rounded-xl bg-zinc-200 hover:ring-zinc-300 hover:shadow-md ring-2 ring-zinc-300
          flex flex-row gap-4 items-center justify-center   text-black font-thin transition-all"
          onClick={() => authClient.signIn.social({ provider: "google" })}
        >
          Sign in with Google <FcGoogle />
        </button>
        <button
          className="w-64 py-1 rounded-xl bg-zinc-200 hover:shadow-md hover:ring-2 ring-2
          flex flex-row gap-x-4 items-center justify-center ring-zinc-300 text-black  font-thin transition-all"
          onClick={() => authClient.signIn.social({ provider: "github" })}
        >
          Sign in with GitHub <PiGithubLogoLight />
        </button>
      </div>
    </div>
  );
}
