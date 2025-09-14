"use client";
import { components } from "@/components";
import Error from "next/error";
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
    <div className="h-full w-full flex items-center justify-center">
      {component.component}
    </div>
  );
}
