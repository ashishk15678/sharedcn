"use client";
import { components } from "@/components";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { useCallback, useMemo } from "react";

export default function Page() {
  const uniqueTags = useMemo(() => {
    const allTags = components.flatMap((component) => component.tags);
    return [...new Set(allTags)];
  }, [components]);

  const groupedComponents = useMemo(() => {
    // First, get all unique tags from the components
    const uniqueTags = [...new Set(components.flatMap((c) => c.tags))].sort(); // Sort for consistent order

    // Then, for each tag, find all components that have it
    return uniqueTags.map((tag) => ({
      tag: tag,
      // Filter the main array to get components for the current tag
      components: components.filter((component) =>
        component.tags.includes(tag),
      ),
    }));
  }, []);

  return (
    <div className="h-[80vh] w-screen  flex justify-center">
      <div className="absolute right-2 top-2">
        <ThemeToggle />
      </div>

      <div className=" container md:max-w-3xl lg:max-w-5xl  p-4">
        <p className="text-2xl font-bold font-sans"> Components showcase :</p>

        <div className="w-full   space-x-4 mt-8">
          {uniqueTags.map((tag) => (
            <Link href={"#" + tag}>
              <button
                key={tag}
                className="bg-gradient-to-r ring ring-zinc-100 dark:ring-zinc-700 shadow-xs rounded-xl px-2   mt-4"
              >
                {tag}
              </button>
            </Link>
          ))}
        </div>

        <div className="flex flex-col space-y-8 mt-12 overflow-y-auto h-full    ">
          {groupedComponents.map((tag) => (
            <section
              className="border-y-2 border-zinc-50 dark:border-zinc-700 pt-2"
              id={tag.tag}
            >
              <span>{tag.tag}</span>
              <div className="flex flex-row p-2 overflow-x-auto space-x-8 scrolling-text">
                {tag.components.map((comp) => (
                  <div
                    onClick={() => {
                      window.history.pushState(
                        {},
                        "",
                        `/component/${comp.title.split(" ").join("-")}`,
                      );
                    }}
                    className="ring relative flex items-center flex-shrink-0 justify-center ring-zinc-100 group dark:ring-zinc-700 rounded-lg h-40 w-60 overflow-hidden p-2"
                  >
                    <div className="absolute -z-1 ">{comp.component}</div>
                    <div className="absolute p-4 bottom-0 left-0 transition-all">
                      {/* <span className="font-bold group-hover:hidden transition-all duration-500">
                        {comp.title}
                        </span> */}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
