"use server";
import { LoginForm, LoginUsingProvider } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/constants";
import { Suspense } from "react";
import { FcGoogle } from "react-icons/fc";
import { PiGithubLogoLight } from "react-icons/pi";
import { requireUnAuth } from "@/lib/auth-utils";
import { unstable_ViewTransition as ViewTransition } from "react";
export default async function SignInPage() {
  await requireUnAuth();
  return (
    <div className="h-screen w-full  bg-gradient-to-b from-white via-white to-zinc-300 flex items-center justify-center">
      <div className="bg-gradient-to-br from-zinc-100 to-zinc-50 p-8 rounded-2xl shadow-lg flex flex-col items-center gap-6 border-2 border-zinc-100">
        <div className=" mb-2">
          <h1 className="text-2xl text-zinc-700 font-bold">
            Login to{" "}
            <ViewTransition name="app_name">{APP_NAME}</ViewTransition>{" "}
          </h1>
          <p className="text-sm text-muted-foreground">
            Continue to the app and start uploading your components and files
          </p>
        </div>
        <LoginUsingProvider
          title="Google"
          provider="google"
          icon={<FcGoogle />}
          className="w-full border-muted-foreground"
        />

        <LoginUsingProvider
          title="Github"
          provider="github"
          icon={<PiGithubLogoLight />}
          className="w-full"
        />

        <Separator decorative={false} />

        <LoginForm />
      </div>
    </div>
  );
}
