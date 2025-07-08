"use client";
import { components } from "@/components";
import { authClient } from "@/lib/auth-client";
import { User } from "better-auth";
import { Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo, useState, useEffect } from "react";
import React from "react";

export default function Page() {
  const [components, setComponents] = useState<any[]>([]);
  const [component, setComponent] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null | undefined>(null);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const router = useRouter();
  useMemo(async () => {
    const session = authClient.getSession();
    let curUser = null;
    session.then((s) => setUser(s.data?.user));
    setUser(curUser);
  }, []);

  const appBar = [
    {
      id: 0,
      name:
        user !== undefined && user !== null ? (
          <>
            <Image
              src={user?.image || ""}
              alt={user?.name.split(" ")[0]}
              height={30}
              width={30}
              className="rounded-full shadow-zinc-400 shadow-xl ring ring-zinc-300"
            />
          </>
        ) : (
          "Sign in"
        ),
      link: "/sign-in",
    },
    user !== undefined && user !== null
      ? {
          id: 1,
          name: (
            <div>
              <button
                onClick={() => {
                  authClient.signOut();
                  router.refresh();
                }}
              >
                Sign out
              </button>
            </div>
          ),
          link: "",
        }
      : { id: 9, name: "", link: "" },
    { id: 2, name: "Checkout the docs", link: "/docs" },
    { id: 3, name: "Why ?", link: "/docs" },
    { id: 4, name: "Dashboard", link: "/dashboard" },
  ];

  // Fetch components from DB
  useEffect(() => {
    async function fetchComponents() {
      setLoading(true);
      try {
        const res = await fetch("/api/components/all");
        if (!res.ok) throw new Error("Failed to fetch components");
        const data = await res.json();
        setComponents(data);
      } catch (e) {
        setComponents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchComponents();
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* <div
        style={{
          background: "#fffbe6",
          color: "#ad8b00",
          padding: "12px 0",
          textAlign: "center",
          fontWeight: "bold",
          borderBottom: "2px solid #ffe58f",
          fontSize: "1.1em",
        }}
      >
        ⚠️ The CLI push command is currently <b>halted</b>. Please use only the
        fetch/add features for now.
      </div> */}
      <div
        className="h-screen  w-full  bg-gradient-to-t from-zinc-950/95 via-zinc-900/20 to-zinc-950/95 flex items-center justify-center"
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
        <div className="absolute z-99 top-10 px-1 md:px-8 py-1 md:py-4 rounded-3xl text-zinc-500  text-sm  md:text-xl bg-zinc-900  ring-2 hover:shadow-lg hover:shadow-zinc-800 transition-all ring-zinc-700 flex flex-row space-x-1 md:space-x-4">
          {appBar.map((a) => (
            <Link href={a.link} key={a.id}>
              <div className="hover:text-zinc-200 transition-all cursor-pointer">
                {a.name}
              </div>
            </Link>
          ))}
        </div>

        <div className="w-full absolute top-2 border-t-2 border-dashed border-zinc-900 bg-zinc-800 m-12" />

        <div className="h-full border-l-2 border-dashed border-zinc-900 bg-zinc-800 m-12" />
        <div
          className="md:p-3 p-1 border-4 border-zinc-800 rounded-2xl flex flex-row gap-2 bg-gradient-to-bl from-yellow-500/20 
           hover:from-yellow-500/30 via-zinc-950  to-yellow-500/30 hover:to-yellow-500/40 transition-colors
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
              className="mt-4 text-zinc-600 text-md w-full flex flex-col gap-y-1 p-2 ring ring-zinc-800 bg-zinc-800/40 rounded-xl h-[330px] overflow-auto
            
            "
            >
              {loading ? (
                <li className="text-zinc-500">Loading...</li>
              ) : components.length > 0 ? (
                components.map((component) => (
                  <li
                    key={component.id}
                    onClick={() => setComponent(component)}
                    className="hover:translate-x-2 transition-all hover:text-zinc-100 cursor-pointer"
                  >
                    {component.name || component.alias}
                  </li>
                ))
              ) : (
                <li className="text-zinc-500">No components found.</li>
              )}
            </ul>
          </div>
          <div></div>
          <div className="w-[400px]  h-[400px]  rounded-xl  ring ring-zinc-800 bg-zinc-900 flex items-center flex-col">
            {component ? (
              <div className="mt-8 w-full h-full max-w-full max-h-full overflow-auto flex flex-col items-center gap-4">
                {Array.isArray(component.code) ? (
                  <>
                    <div className="flex flex-row gap-2 w-full mb-2">
                      {component.code.map((file: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setActiveFileIdx(idx)}
                          className={`px-3 py-1 rounded-t border-b-2 ${
                            activeFileIdx === idx
                              ? "border-yellow-400 text-yellow-300"
                              : "border-transparent text-zinc-400"
                          } font-mono text-xs transition-all`}
                        >
                          {file.filename}
                        </button>
                      ))}
                    </div>
                    <pre className="w-full max-h-64 overflow-auto bg-zinc-800 text-zinc-100 p-2 rounded-b-md whitespace-pre-wrap border border-zinc-800 shadow-md">
                      {component.code[activeFileIdx]?.code}
                    </pre>
                  </>
                ) : (
                  <pre className="w-full h-full max-w-full max-h-full overflow-auto bg-zinc-800 text-zinc-100 p-2 rounded-md whitespace-pre-wrap">
                    {component.code}
                  </pre>
                )}
                <div className=" font-mono mt-6 ml-2 p-2 text-zinc-200 flex flex-col">
                  Command :
                  <p className="bg-zinc-800  text-pink-400 p-2 rounded-md flex flex-row gap-x-2 items-center justify-center">
                    npx sharedcn add {component.name || component.alias}
                    <button className="p-2 rounded-md flex items-center justify-center">
                      <Copy className="text-green-500" size={15} />
                    </button>
                  </p>
                  <div className="mt-6  rounded-md cursor-pointer">
                    <p className="text-sm text-zinc-500">
                      Copy code ? and paste it in a file
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-xl text-zinc-600 mx-8">
                Go ahead select a component , noone's watching
              </div>
            )}
          </div>
        </div>
        <div className="h-full border-l-2 border-dashed border-zinc-900 bg-zinc-800 m-12" />
      </div>
      {/* <div
        className="bg-yellow-800/20"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          color: "#ad8b00",
          padding: "2px 0",
          textAlign: "center",
          fontWeight: 400,
          borderTop: "1px solid #ffe58f",
          fontSize: "0.80em",
          opacity: 0.7,
          zIndex: 1000,
        }}
      >
        ⚠️ The CLI setup-auth command is currently <b>halted</b>. Please use
        only the add/push features for now. In push your components will be
        added but with @public prefix
      </div> */}
    </div>
  );
}
