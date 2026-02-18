"use client";
import { components } from "@/components";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Copy } from "lucide-react";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";

export default function Page() {
  const path = usePathname().slice(1);
  //   console.log(c.title.split("-").join(" "));
  const pathname = path.split("/")[1];
  console.log(pathname);
  const component: (typeof components)[0] | undefined = components
    .map((c) => {
      if (c.title.split("-").join(" ") == pathname.split("-").join(" ")) {
        return c;
      }
    })
    .filter((c) => c)[0];

  if (!component || component == undefined) {
    return notFound();
  }
  return (
    <div className="h-full w-full flex items-center justify-center ">
      <div className="max-w-3xl w-full h-full">
        <div>
          <Link href={"/component"} prefetch>
            <Button
              size={"lg"}
              variant={"secondary"}
              className=" group flex flex-row gap-x-1 mt-2"
            >
              <ChevronLeftIcon className="group-hover:-translate-x-1.5 transition-all" />{" "}
              Back
            </Button>
          </Link>
          <div className="py-8 ">
            <div className="flex flex-row space-x-6 text-xl">
              <p className="font-bold">{component.title}</p>
            </div>
            <div className="flex flex-row space-x-6 text-xl">
              <p className="text-muted-foreground">{component.description}</p>
            </div>
          </div>
          <div className="flex flex-row space-x-2 py-4">
            {component.tags.map((tag) => (
              <button className="rounded-xl ring ring-border px-2 py-0.5 text-sm text-muted-foreground">
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-16 w-full flex items-center justify-center ">
          {component.component}
        </div>
        <div
          className="inner-shadow  bg-background overflow-auto py-4 px-6 rounded-sm relative
          mt-16"
        >
          {" "}
          <button
            className="absolute right-2 top-2 "
            onClick={() => {
              window.navigator.clipboard.writeText(component.code || "");
            }}
          >
            {" "}
            <Copy size={18} />{" "}
          </button>
          <pre>{component.code}</pre>
        </div>
      </div>
    </div>
  );
}
