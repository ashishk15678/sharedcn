"use client";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { IconType } from "react-icons/lib";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input, InputWithPassword } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShinyButton } from "../ui/shiny-button";

export const formSchema = z.object({
  email: z.email({}).min(1, "Email is a required field"),
  password: z.string().min(1, "Password is required field"),
});

export function LoginForm() {
  const form = useForm<z.Infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    authClient.signIn.email(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          router.push("/dashboard?msg=Successfully+signed+in");
        },
        onError: (error) => {
          toast.error(`${error.error.cause} : ${error.error.message}`);
        },
      },
    );
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-y-3"
        >
          {/* --- Email Field --- */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-black/50">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    className="ring ring-zinc-300/50 text-black/50 rounded-2xl"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your account email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Password Field --- */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-black/50">
                  Password
                </FormLabel>
                <FormControl>
                  {/* Note: Use type="password" for sensitive fields */}
                  <InputWithPassword
                    placeholder="Enter your password"
                    type="password"
                    className="ring ring-zinc-300/50 text-black/50 rounded-2xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="rounded-3xl ring-2 ring-zinc-300 bg-zinc-100 mt-4 text-black/50 hover:text-black/80"
            variant={"outline"}
            disabled={form.formState.isSubmitting}
          >
            Signin using email
          </Button>
        </form>
      </Form>
      <div className="w-full flex justify-end">
        <Link href={"/register"} prefetch>
          <Button variant={"link"} className="cursor-pointer text-black/50">
            Don{"'"}t have an account ?
          </Button>
        </Link>
      </div>
    </>
  );
}

export function LoginUsingProvider({
  icon,
  title,
  provider,
  className,
  ...props
}: {
  icon: ReactNode;
  title: string;
  provider: string;
  className?: string;
}) {
  const Icon = icon;
  return (
    <button
      className={cn(
        "w-64 py-1 rounded-xl bg-zinc-100 hover:ring-zinc-300 hover:shadow-md ring-2 ring-zinc-300",
        "flex flex-row gap-4 items-center justify-center   text-black font-thin transition-all",
        className,
      )}
      onClick={async () =>
        await authClient.signIn.social({ provider: provider })
      }
      {...props}
    >
      Sign in with {title} {Icon}
    </button>
  );
}
