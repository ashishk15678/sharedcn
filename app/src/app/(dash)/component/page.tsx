"use client";
import { components } from "@/components";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

export default function Page() {
  const uniqueTags = useMemo(() => {
    const allTags = components.flatMap((component) => component.tags);
    return [...new Set(allTags)];
  }, [components]);

  const groupedComponents = useMemo(() => {
    const uniqueTags = [...new Set(components.flatMap((c) => c.tags))].sort(); // Sort for consistent order

    return uniqueTags.map((tag) => ({
      tag: tag,
      components: components.filter((component) =>
        component.tags.includes(tag),
      ),
    }));
  }, []);

  const [activeTag, setActiveTag] = useState("");

  return (
    <div className="h-[80vh] w-screen  flex justify-center">
      <div className="absolute right-2 top-2">
        <ThemeToggle />
      </div>

      <div className="max-w-7xl w-full  p-6">
        <p className="text-3xl font-bold font-sans"> Components showcase :</p>

        <div className="w-full   space-x-4 mt-8">
          {uniqueTags.map((tag) => (
            <Link
              href={"#" + tag}
              onClick={() => {
                if (activeTag == tag) {
                  setActiveTag("");
                } else {
                  setActiveTag(tag);
                }
              }}
            >
              <button
                key={tag}
                className={cn(
                  "bg-gradient-to-r ring ring-zinc-100 dark:ring-zinc-700  rounded-xl px-2 text-sm   mt-4",
                  activeTag == tag
                    ? " text-primary ring-border shadow-md"
                    : "ring-secondary text-primary/50",
                )}
              >
                {tag}
              </button>
            </Link>
          ))}
        </div>

        <div className="flex flex-col space-y-8 mt-12 overflow-auto h-full    ">
          {groupedComponents.map((tag) => (
            <section className=" py-2" id={tag.tag}>
              <span className="text-xl font-bold ml-4">{tag.tag}</span>
              <div className="flex flex-row p-2 overflow-x-auto hide-scrollbar space-x-8 overflow-hidden">
                {tag.components.map((comp) => (
                  <Link
                    href={`/component/${comp.title.split(" ").join("-")}`}
                    prefetch
                  >
                    <div className="ring relative flex inset-shadow-sm items-center flex-shrink-0 justify-center ring-border rounded-lg h-50 w-80 overflow-hidden p-2">
                      <div className=" ">{comp.component}</div>
                      <div className="absolute p-4 bottom-0 left-0 transition-all">
                        {/* <span className="font-bold group-hover:hidden transition-all duration-500">
                        {comp.title}
                        </span> */}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
