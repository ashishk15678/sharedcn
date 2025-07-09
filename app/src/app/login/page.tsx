"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { PiGithubLogoLight } from "react-icons/pi";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // If already signed in, redirect to dashboard
    authClient.getSession().then((session) => {
      if (session.data?.user.email) router.replace("/dashboard");
    });
  }, [router]);

  toast.warning("Please use google auth , github seems to have issues");

  return (
    <div className="h-screen w-full  bg-gradient-to-b from-black via-zinc-900 to-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg flex flex-col items-center gap-6 border-2 border-zinc-800">
        <h1 className="text-2xl text-zinc-400 font-bold mb-2">
          Continue to Icons
        </h1>
        <button
          className="w-64 py-1 rounded-xl bg-zinc-800 hover:ring-zinc-600 hover:ring-2 ring-2 ring-zinc-700
          flex flex-row gap-4 items-center justify-center   text-white font-thin transition-all"
          onClick={() => authClient.signIn.social({ provider: "google" })}
        >
          Sign in with Google <FcGoogle />
        </button>
        <button
          className="w-64 py-1 rounded-xl bg-zinc-800 hover:ring-zinc-600 hover:ring-2 ring-2
          flex flex-row gap-x-4 items-center justify-center ring-zinc-700 text-white font-thin transition-all"
          onClick={() => authClient.signIn.social({ provider: "github" })}
        >
          Sign in with GitHub <PiGithubLogoLight />
        </button>
      </div>
    </div>
  );
}
