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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const formSchema = z.object({
  name: z.string().min(1, "Name is a required field"),
  email: z.email({}).min(1, "Email is a required field"),
  password: z.string().min(1, "Password is required field"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
});

export function RegisterForm() {
  const form = useForm<z.Infer<typeof formSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Password and confirm password donot match");
      return;
    }
    authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Name</FormLabel>
                <FormControl>
                  <Input placeholder="John doe" type="text" {...field} />
                </FormControl>
                <FormDescription>This is your account name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Email Field --- */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
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
                <FormLabel className="font-bold">Password</FormLabel>
                <FormControl>
                  {/* Note: Use type="password" for sensitive fields */}
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Confirm Password Field --- */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="rounded-3xl ring-2 ring-zinc-300 bg-zinc-100 mt-4"
            variant={"outline"}
            disabled={form.formState.isSubmitting}
          >
            Sign up using email
          </Button>
        </form>
      </Form>
      <div className="w-full flex justify-end">
        <Link href={"/login"} prefetch>
          <Button variant={"link"} className="cursor-pointer">
            Already have an account ?
          </Button>
        </Link>
      </div>
    </>
  );
}

export function RegisterUsingProvider({
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
        "w-64 py-1 rounded-xl bg-zinc-100 hover:ring-zinc-300 hover:shadow-md ring-1 ring-zinc-300",
        "flex flex-row gap-4 items-center justify-center   text-black font-thin transition-all",
        className,
      )}
      onClick={async () =>
        await authClient.signIn.social({ provider: provider })
      }
      {...props}
    >
      Sign up with {title} {Icon}
    </button>
  );
}
