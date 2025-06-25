"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // If already signed in, redirect to dashboard
    authClient.getSession().then((session) => {
      if (session) router.replace("/dashboard");
    });
  }, [router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-black via-zinc-950 to-zinc-700">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg flex flex-col items-center gap-6 border-2 border-zinc-800">
        <h1 className="text-2xl text-zinc-100 font-bold mb-2">Sign in</h1>
        <button
          className="w-64 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
          onClick={() => authClient.signIn}
        >
          Sign in with Google
        </button>
        <button
          className="w-64 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-all"
          onClick={() => authClient.signIn}
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
