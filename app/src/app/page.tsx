"use client";
import { components } from "@/components";
import { ReactNode, useState } from "react";

export default function Page() {
  const [component, setComponent] = useState<ReactNode | null>(null);
  return (
    <div
      className="h-screen w-full  bg-gradient-to-b from-black via-zinc-950 to-zinc-700 flex items-center justify-center"
      onClick={(e) => {
        // e.preventDefault();
        // e.stopPropagation();
        // if (component !== null) {
        //   setComponent(null);
        // }
      }}
    >
      {/* <div className="absolute w-[200px] h-[250px] rounded-full bg-pink-700/20 blur-xl top-40 right-30 z-1" />
      <div className="absolute w-[100px] h-[100px] rounded-full bg-pink-600/40 blur-xl top-[350px] right-32 z-1" /> */}
      <div className="absolute top-10 px-8 py-4 rounded-3xl text-zinc-500 hover:text-zinc-400 text-xl bg-zinc-900  ring-2 hover:shadow-lg hover:shadow-zinc-800 transition-all ring-zinc-700 flex flex-row space-x-4">
        <div>Sign in</div>

        <div>Checkout the docs</div>
        <div>What's new ?</div>
        <div>Dashboard</div>
      </div>

      <div
        className="p-4 border-4 border-zinc-800 rounded-2xl flex flex-row gap-4 bg-gradient-to-br from-zinc-950 via-zinc-950  to-yellow-500/30 hover:to-yellow-500/40 transition-colors
       text-zinc-100"
      >
        <div className="border border-zinc-800 p-2 rounded-xl bg-zinc-900">
          <input
            type="text"
            placeholder="Components"
            className="text-md  border border-zinc-800 rounded-lg p-1 px-4 bg-zinc-800/60  w-[180px] placeholder:text-zinc-200 text-zinc-200
            "
          />
          <ul
            className="mt-4 text-zinc-400 text-md w-full flex flex-col gap-y-1 p-2 ring ring-zinc-800 bg-zinc-800/40 rounded-xl h-[330px] overflow-auto
          
          "
          >
            {components.map((component) => (
              <li
                onClick={() => setComponent(component.component)}
                className="hover:translate-x-2 transition-all hover:text-zinc-100 cursor-pointer"
              >
                {component.title}
              </li>
            ))}
          </ul>
        </div>
        <div></div>
        <div className="w-[400px]  h-[400px] rounded-xl ring ring-zinc-800 bg-zinc-900 flex items-center flex-col">
          {component ? (
            <div className="mt-8"> {component}</div>
          ) : (
            <div className="mt-8 text-xl text-zinc-600 mx-8">
              Go ahead select a component , noone's watching
            </div>
          )}{" "}
        </div>
      </div>
    </div>
  );
}
