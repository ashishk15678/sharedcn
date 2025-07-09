"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MoveRightIcon, X } from "lucide-react";
import ComponentCard from "@/components/ui/ComponentCard";
import ComponentModal from "@/components/ui/ComponentModal";
import { Loader2, XCircle } from "lucide-react";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { Mail, Twitter, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Menu } from "lucide-react";

function useTiltCard() {
  const ref = useRef(null);
  // ... same as useTilt from utils, but inline for this file ...
  // (or import from utils if you prefer)
  // ...
  return ref;
}

function ContactCard({
  icon,
  label,
  value,
  href,
  color,
  preferred = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  href: string;
  color: "pink" | "blue" | "green";
  preferred?: boolean;
}) {
  const ref = useTiltCard();
  // Color maps
  const colorMap = {
    pink: {
      base: "zinc-600",
      hoverBg: "bg-pink-50",
      hoverText: "text-pink-600",
      ring: "ring-pink-300",
      shadow: "shadow-pink-300",
      shadowHover: "shadow-pink-400",
      text: "text-pink-600",
      icon: "text-pink-500",
    },
    blue: {
      base: "zinc-600",
      hoverBg: "bg-blue-50",
      hoverText: "text-blue-600",
      ring: "ring-blue-300",
      shadow: "shadow-blue-300",
      shadowHover: "shadow-blue-400",
      text: "text-blue-600",
      icon: "text-blue-500",
    },
    green: {
      base: "zinc-600",
      hoverBg: "bg-green-50",
      hoverText: "text-green-600",
      ring: "ring-green-300",
      shadow: "shadow-green-300",
      shadowHover: "shadow-green-400",
      text: "text-green-600",
      icon: "text-green-500",
    },
  };
  const c = colorMap[color];
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      ref={ref as any}
      className={cn(
        "relative flex flex-col items-center justify-center px-8 py-6 rounded-2xl ring-2 shadow-md transition-all duration-300 group cursor-pointer select-text min-w-[220px] w-full",
        `bg-white/80 ring-zinc-200 text-${c.base}`,
        `hover:${c.hoverBg} hover:${c.ring} hover:${c.shadowHover} hover:${c.hoverText}`,
        preferred && "border-2 border-zinc-400 hover:border-pink-400"
      )}
      style={{ textDecoration: "none" }}
    >
      <div className="mb-2 flex items-center gap-2 w-full justify-center">
        {/* Icon with color transition */}
        <span
          className={cn(
            `transition-colors duration-200 group-hover:${c.icon} ${c.base}`
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "mt-1 font-semibold transition-colors duration-200",
            `group-hover:${c.hoverText} ${c.base}`
          )}
        >
          {value}
        </span>
        {/* {preferred && (
          <span className="relative flex h-3 w-3 ml-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
          </span>
        )} */}
      </div>
    </a>
  );
}

export default function HomePage() {
  const [navState, setNavState] = useState<"expanded" | "collapsed">(
    "expanded"
  );
  const [lastScroll, setLastScroll] = useState(0);
  const [showcase, setShowcase] = useState<any[]>([]);
  const [showcaseLoading, setShowcaseLoading] = useState(true);
  const [showcaseComponent, setShowcaseComponent] = useState<any | null>(null);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [selectedShowcaseIdx, setSelectedShowcaseIdx] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "loading" | "available" | "taken" | "error" | "success"
  >("idle");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debounced username check (useCallback + debounce)
  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (!username || username.length < 3) {
        setUsernameStatus("idle");
        setUsernameMsg("");
        return;
      }
      setUsernameStatus("loading");
      setUsernameMsg("");
      const res = await fetch(
        `/api/username/check?username=${encodeURIComponent(username)}`
      );
      if (!res.ok) {
        setUsernameStatus("error");
        setUsernameMsg("Error checking username");
        return;
      }
      const data = await res.json();
      if (data.available) {
        setUsernameStatus("available");
        setUsernameMsg("available!");
      } else {
        setUsernameStatus("taken");
        setUsernameMsg("taken");
      }
    }, 500),
    []
  );

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y > lastScroll + 30) {
            setNavState("collapsed");
            setLastScroll(y);
          } else if (y < lastScroll - 30) {
            setNavState("expanded");
            setLastScroll(y);
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  useEffect(() => {
    fetch("/api/components/all")
      .then((r) => r.json())
      .then(setShowcase)
      .finally(() => setShowcaseLoading(false));
  }, []);

  // Map backend data to dashboard card props
  const showcaseMapped = showcase.map((comp) => ({
    id: comp.id,
    title: comp.name || comp.alias,
    description: comp.description,
    tags: Array.isArray(comp.dependent)
      ? comp.dependent
      : typeof comp.dependent === "string"
      ? comp.dependent
          .split(",")
          .map((d: string) => d.trim())
          .filter(Boolean)
      : [],
    component: null, // Optionally render a preview if you have one
    code: Array.isArray(comp.code)
      ? comp.code.map((f: any) => `// ${f.filename}\n${f.code}`).join("\n\n")
      : typeof comp.code === "string"
      ? comp.code
      : "",
  }));

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUsername(value);
    setUsernameStatus("idle");
    setUsernameMsg("");
    checkUsernameAvailability(value);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Navbar */}
      <nav
        className={`fixed left-1/2 z-50 transition-all duration-500 ease-in-out
          ${navState === "expanded" ? "top-8" : "top-0"}
          -translate-x-1/2
          w-full flex justify-center pointer-events-none
        `}
        style={{
          width:
            navState === "expanded" ? "min(96vw, 1100px)" : "min(80vw, 700px)",
        }}
      >
        <div
          className={`bg-white/40 backdrop-blur-2xl rounded-2xl  border border-gray-100 flex justify-between items-center px-4 md:px-6 py-2 transition-all duration-500 pointer-events-auto
            ${navState === "expanded" ? "h-16" : "h-12"}`}
          style={{ width: "100%" }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-black">SharedCN</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#contact"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Contact us
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Dashboard
            </Link>
            <Button
              onClick={() => (window.location.href = "/login")}
              variant="ghost"
              className="text-gray-600 hover:text-black"
            >
              Login
            </Button>
            <Button
              onClick={() => (window.location.href = "/docs")}
              className="bg-black text-white hover:bg-gray-800"
            >
              Documentation
            </Button>
          </div>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100 transition"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-zinc-700" />
          </button>
        </div>
      </nav>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex flex-col">
          <div className="bg-white w-5/6 max-w-xs h-full shadow-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-black">SharedCN</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-zinc-700" />
              </button>
            </div>
            <Link
              href="#contact"
              className="text-zinc-700 text-lg py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact us
            </Link>
            <Link
              href="/dashboard"
              className="text-zinc-700 text-lg py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                window.location.href = "/login";
              }}
              variant="ghost"
              className="text-zinc-700 text-lg py-2"
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                window.location.href = "/docs";
              }}
              className="bg-black text-white text-lg py-2"
            >
              Documentation
            </Button>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
      {/* Main content: add responsive classes to all flex/grid layouts */}
      <div className="w-full flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto border-x-2 border-dashed border-zinc-300 bg-white w-full">
          {/* Hero Section */}
          <section className="relative py-32 mt-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative">
              {/* Floating Badges - positioned like in the original */}
              <div className="absolute -top-10 left-20 hidden lg:block">
                <Badge className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                  Public and open to all
                </Badge>
              </div>
              <div className="absolute top-20 right-32 hidden lg:block">
                <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  Easy to use
                </Badge>
              </div>
              <div className="absolute top-40 left-32 hidden md:block">
                <Badge className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  cli based
                </Badge>
              </div>

              <h1 className="text-4xl md:text-7xl font-extrabold mb-4 text-black leading-tight">
                Share your components/code snippets
              </h1>
              <h2 className="text-4xl md:text-7xl font-light text-gray-400 italic mb-16 leading-tight">
                the easy way.
              </h2>

              {/* Badge */}
              <div className="flex justify-center items-center gap-x-6">
                <a
                  href="https://www.producthunt.com/products/sharedcn?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-sharedcn"
                  target="_blank"
                >
                  <Image
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=989465&theme=light&t=1751992034819"
                    alt="SharedCN - Easily&#0032;share&#0032;your&#0032;components&#0032;&#0044;&#0032;with&#0032;only&#0032;CLI&#0032;&#0046; | Product Hunt"
                    className="w-[200px] h-[120px]"
                    width="200"
                    height="120"
                  />
                </a>

                <div>
                  <Link
                    target="_blank"
                    href={"https://peerlist.io/ashishk/project/sharedcn"}
                  >
                    <Image
                      width={200}
                      height={120}
                      alt="Live on peerlist"
                      src="/peerlist-live.svg"
                    />
                  </Link>
                </div>
              </div>
            </div>{" "}
          </section>

          {/* Features Section */}
          <div className="border-t-2 border-dashed border-zinc-300" />
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-normal mb-4 text-black leading-tight">
                  More than a library.
                </h2>
                <h3 className="text-5xl md:text-6xl font-light text-gray-400 italic leading-tight">
                  It's your dev workflow.
                </h3>
                <p className="text-2xl mt-4 text-zinc-600">
                  With our integrated cli , make your work just{" "}
                  <b>
                    " <i>fast</i> "
                  </b>
                </p>
              </div>
            </div>

            <div className=" rounded-xl">
              <BentoTabs />
            </div>
          </section>

          {/* Showcase Components Section */}
          <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-50 to-white border-t border-zinc-100">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-4 text-center">
                Explore Shared Components
              </h2>
              <p className="text-zinc-500 text-center mb-10">
                Browse real components shared by the community. Click to preview
                code and files.
              </p>
              {/* Dashboard-style preview box */}
              <div className="flex flex-row gap-6 mb-12 h-96">
                {/* Left: List of components */}
                <div className="border border-zinc-200 rounded-xl bg-white w-30 md:w-64 p-4 flex flex-col h-full overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Search components..."
                    className="mb-4 px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-sm"
                    // Optionally add search state/logic
                    disabled
                  />
                  <ul className="flex-1 overflow-y-auto space-y-1">
                    {showcaseMapped.length === 0 ? (
                      <li className="text-zinc-400 text-sm">
                        No components yet.
                      </li>
                    ) : (
                      showcaseMapped.map((comp, idx) => (
                        <li
                          key={comp.id}
                          className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-all ${
                            idx === selectedShowcaseIdx
                              ? "bg-yellow-100 text-yellow-800 font-semibold"
                              : "hover:bg-zinc-100 text-zinc-700"
                          }`}
                          onClick={() => setSelectedShowcaseIdx(idx)}
                        >
                          {comp.title}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                {/* Right: Preview box */}
                <div className="flex-1 min-w-0 border border-zinc-200 rounded-xl bg-white p-6 flex flex-col h-full overflow-y-auto">
                  {showcaseMapped.length === 0 ? (
                    <div className="text-zinc-400 text-center my-16">
                      No component selected.
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xl font-bold text-zinc-900">
                          {showcaseMapped[selectedShowcaseIdx].title}
                        </div>
                        <span className="font-mono text-xs text-zinc-400">
                          ID: {showcaseMapped[selectedShowcaseIdx].id}
                        </span>
                      </div>
                      <div className="text-zinc-500 text-sm mb-2">
                        {showcaseMapped[selectedShowcaseIdx].description}
                      </div>
                      {/* <div className="flex flex-wrap gap-2 mb-4">
                        {showcaseMapped[selectedShowcaseIdx].tags.map(
                          (tag: string, i: number) => (
                            <span
                              key={i}
                              className="bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded text-xs"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div> */}
                      {/* Install command */}
                      <div className="mb-4 flex items-center gap-2">
                        <span className="bg-zinc-100 text-yellow-800 px-3 py-1 rounded font-mono text-xs select-all">
                          npx sharedcn add{" "}
                          {showcaseMapped[selectedShowcaseIdx].title
                            .replace(/\s+/g, "-")
                            .toLowerCase()}
                        </span>
                        <button
                          className="ml-2 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `npx sharedcn add ${showcaseMapped[
                                selectedShowcaseIdx
                              ].title
                                .replace(/\s+/g, "-")
                                .toLowerCase()}`
                            )
                          }
                        >
                          Copy
                        </button>
                      </div>
                      {/* Code preview */}
                      <div className="bg-zinc-100 text-zinc-700 rounded-lg p-4 overflow-auto text-xs h-full whitespace-pre-wrap border border-zinc-100 shadow-inner">
                        <pre>{showcaseMapped[selectedShowcaseIdx].code}</pre>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* Cards grid (existing)
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {showcaseMapped.map((comp) => (
                  <ComponentCard
                    key={comp.id}
                    component={comp}
                    onSelect={() => setShowcaseComponent(comp)}
                  />
                ))}
              </div> */}
            </div>

            {/* Showcase Preview Modal */}
            {showcaseComponent && (
              <ComponentModal
                component={showcaseComponent}
                onClose={() => setShowcaseComponent(null)}
              />
            )}
          </section>
          <div className="border-t-2 border-zinc-300 border-dashed" />
          {/* Community Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-normal mb-4 text-black leading-tight">
                  Explore developers. See
                </h2>
                <h3 className="text-5xl md:text-6xl font-light text-gray-400 italic leading-tight">
                  their contributions.
                </h3>
              </div>

              <div className="grid grid-cols-3 lg:grid-cols-6 gap-8">
                {[
                  {
                    name: "Fred Tinsel",
                    username: "@ftinsel",
                    color: "bg-gray-800",
                  },
                  {
                    name: "Socrates Charisis",
                    username: "@sochar",
                    color: "bg-pink-400",
                  },
                  {
                    name: "Fabien Colombier",
                    username: "@fabulen",
                    color: "bg-orange-400",
                  },
                  {
                    name: "Ifeoluwa Oduse",
                    username: "@ifelani",
                    color: "bg-pink-300",
                  },
                  {
                    name: "Paul Huxen",
                    username: "@phuxen",
                    color: "bg-gray-300",
                  },
                  {
                    name: "Victor Ndekei",
                    username: "@ndekei",
                    color: "bg-orange-600",
                  },
                  {
                    name: "Kyaw Zay Ya",
                    username: "@kyawzayya",
                    color: "bg-purple-600",
                  },
                  {
                    name: "Sam Vickars",
                    username: "@samvickars",
                    color: "bg-blue-400",
                  },
                  {
                    name: "Ebube Mike-Nzeagwu",
                    username: "@igndesign",
                    color: "bg-yellow-400",
                  },
                  {
                    name: "Oluwatobiloba Oladu...",
                    username: "@olamool",
                    color: "bg-blue-300",
                  },
                  {
                    name: "Dvija Shah",
                    username: "@dvija",
                    color: "bg-blue-500",
                  },
                  {
                    name: "Aravind Solaappan",
                    username: "@aravindsola",
                    color: "bg-pink-200",
                  },
                  {
                    name: "Ignacio Calvo",
                    username: "@igcalvo",
                    color: "bg-gray-400",
                  },
                  {
                    name: "Emmanuel Adegbe - ...",
                    username: "@emmydesign",
                    color: "bg-blue-600",
                  },
                ].map((dev, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`w-16 h-16 ${dev.color} rounded-full mx-auto mb-3 flex items-center justify-center`}
                    >
                      <span className="text-white font-medium text-lg">
                        {dev.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <h3 className="font-medium text-black text-sm mb-1">
                      {dev.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{dev.username}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="py-8 border-t-2 border-zinc-300 border-dashed" />
          <div className="px-12 pb-8">
            <p className="md:text-4xl text-2xl font-normal italic text-zinc-600 mt-4 w-full text-center">
              Choose your username before it vanishes.
            </p>

            <div className="rounded-xl p-2 ring ring-zinc-300 mt-8">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="ring ring-zinc-300 rounded-lg w-full px-2 py-1"
                  placeholder="Choose username"
                  value={username}
                  onChange={handleUsernameChange}
                  minLength={3}
                />
                {usernameStatus === "loading" && (
                  <Loader2 className="animate-spin text-yellow-400 w-5 h-5" />
                )}
                {usernameStatus === "available" && (
                  <svg
                    className="w-6 h-6 text-green-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path className="tick-animate" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {usernameStatus === "success" && (
                  <svg
                    className="w-6 h-6 text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path className="tick-animate" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div className="ml-2">
              {usernameStatus === "taken" && (
                <XCircle className="text-red-400 w-5 h-5 x-shake" />
              )}
              {usernameStatus === "error" && (
                <XCircle className="text-red-500 w-5 h-5 x-shake" />
              )}
              {usernameMsg && (
                <div className="text-xs mt-1 text-zinc-500">{usernameMsg}</div>
              )}
            </div>
          </div>
          <div className="py-6 border-t-2 border-dashed border-zinc-300" />

          <div className="mt-8 p-4 ">
            <div className="rounded-3xl ring ring-zinc-300 p-4 bg-zinc-100">
              <div className="rounded-2xl shadow-md p-6 bg-white">
                <p className="text-4xl font-normal text-zinc-600 italic">
                  Join now where everybody already is
                </p>
                <button
                  className="p-4 w-full bg-gradient-to-r from-violet-700 via-blue-500 to-purple-600 hover:shadow-sm shadow-xl shadow-violet-400 text-white text-2xl rounded-2xl flex flex-row items-center justify-center mt-8 italic
                hover:not-italic transition-all duration-300 gap-x-6 hover:gap-x-8 font-bold"
                >
                  Create your component now <MoveRightIcon size={30} />
                </button>
              </div>
            </div>
          </div>
          <section
            id="contact"
            className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
          >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute -inset-[10px] opacity-40">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-yellow-200 via-pink-100 to-blue-200 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-r from-blue-100 to-blue-200 rounded-full blur-3xl animate-pulse delay-200" />
                <div className="absolute top-3/4 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] bg-gradient-to-r from-pink-100 to-yellow-200 rounded-full blur-3xl animate-pulse delay-500" />
              </div>
            </div>
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-700 italic mb-2">
                Let's Connect!
              </h2>
              <p className="text-zinc-500 mb-10 text-lg">
                Have questions, suggestions, or want to collaborate? Reach out
                and let's build something amazing together!
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 w-full">
                {/* Email - preferred */}
                <ContactCard
                  icon={
                    <Mail
                      size={12}
                      className=" group-hover:text-pink-500 text-zinc-600 transition-colors duration-200"
                    />
                  }
                  label="Email"
                  value={"15678ashish@gmail.com"}
                  href="mailto:15678ashish@gmail.com"
                  color="pink"
                  // preferred
                />
                {/* Twitter/X */}
                <ContactCard
                  icon={
                    <Twitter className="h-6 w-6 group-hover:text-blue-500 text-zinc-600 transition-colors duration-200" />
                  }
                  label="Twitter/X"
                  value={"@ashishonsol"}
                  href="https://twitter.com/ashishonsol"
                  color="blue"
                  preferred
                />
                {/* GitHub */}
                <ContactCard
                  icon={
                    <Github className="h-6 w-6 group-hover:text-green-500 text-zinc-600 transition-colors duration-200" />
                  }
                  label="GitHub"
                  value={"ashishk15678"}
                  href="https://github.com/ashishk15678"
                  color="green"
                />
              </div>
              <div className="text-zinc-400 text-sm mt-8">
                &copy; {new Date().getFullYear()} SharedCN. Made with{" "}
                <span className="text-pink-500">&#10084;</span> by Ashish Kumar.
              </div>
            </div>
          </section>
        </div>
        <div className="h-full border-l-2 border-dashed border-zinc-900 hidden lg:block" />
      </div>
    </div>
  );
}

function BentoTabs() {
  const [tab, setTab] = useState<"cli" | "dashboard">("cli");
  return (
    <div
      className={cn(
        "w-full p-4 transition-all duration-300 rounded-2xl",
        tab == "cli" ? "bg-orange-100" : "bg-green-100"
      )}
    >
      {/* Animated Bento Grid */}
      <div className="relative min-h-[420px] h-[420px] w-full overflow-hidden">
        {/* CLI Grid */}
        <div
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
            tab === "cli" ? "translate-x-0 z-10" : "-translate-x-full z-0"
          } pointer-events-${tab === "cli" ? "auto" : "none"}`}
        >
          <div className="grid grid-cols-2 grid-rows-2 gap-6 w-full h-full">
            <div className="bg-white/90 rounded-2xl shadow-sm border border-zinc-200 p-6 flex flex-col justify-between overflow-auto">
              <h3 className="text-2xl font-semibold mb-2 text-zinc-900">
                Install Instantly
              </h3>
              <p className="text-zinc-600 text-sm mb-2">
                Add any component to your project with a single CLI command. No
                setup, no hassle.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex flex-col md:flex-row">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-mono">
                    npx sharedcn add ...
                  </span>
                  <span className="text-zinc-400 text-xs">or</span>
                  <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-mono">
                    npx sharedcn push ...
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-zinc-50 rounded-2xl shadow-sm border border-zinc-100 p-6 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-yellow-700 mb-1">
                Fast & Reliable
              </span>
              <div className="text-3xl font-extrabold text-yellow-600">
                ~1s to 5s
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                Avg. install time with good internet
              </div>
              <div className="text-lg font-bold text-zinc-700 mt-2 text-center">
                No login required for public components
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-sm border border-zinc-200 p-6 flex flex-col justify-between">
              <h3 className="text-2xl font-semibold mb-2 text-zinc-900">
                Public & Auth Modes
              </h3>
              <p className="text-zinc-600 text-sm mb-2">
                Use public mode and the component has @prefix but with your
                token it will be @username/component_name.
              </p>
              <ul className="list-disc ml-5 text-zinc-500 text-xs space-y-1">
                <li>Secure token-based auth</li>
                <li>Open fetch for everyone</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 flex flex-col justify-around">
              <h3 className="text-2xl font-semibold  text-zinc-900">
                How to add components ?
              </h3>
              <div className="flex flex-col gap-1">
                <i>
                  <p className="text-zinc-600 text-sm">
                    Just type npx add sharedcn add component-name
                  </p>
                </i>
                <p className="text-zinc-600 text-sm font-bold">That's it ?</p>
                <i>
                  {" "}
                  <p className="text-zinc-600 text-sm">Yes indeed !</p>
                </i>
              </div>
            </div>
          </div>
        </div>
        {/* Dashboard Grid */}
        <div
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
            tab === "dashboard" ? "translate-x-0 z-10" : "translate-x-full z-0"
          } pointer-events-${tab === "dashboard" ? "auto" : "none"}`}
        >
          <Image
            src={"/dashboard.png"}
            width={400}
            height={200}
            alt="Dashboard picture"
            className="w-full h-full rounded-xl"
          />
        </div>
      </div>
      {/* Tab Switcher */}
      <div className="flex justify-center my-8">
        <div className="flex rounded-xl shadow p-1 gap-2">
          <button
            className={`px-8 py-2 rounded-lg font-semibold transition-all text-base focus:outline-none ${
              tab === "cli"
                ? "bg-white/50 text-black font-bold"
                : "bg-zinc-100/50 text-zinc-500"
            }`}
            onClick={() => setTab("cli")}
          >
            CLI
          </button>
          <button
            className={`px-8 py-2 rounded-lg font-semibold transition-all text-base focus:outline-none ${
              tab === "dashboard"
                ? "bg-white/50 text-black shadow font-bold"
                : "bg-zinc-100/50 text-zinc-500"
            }`}
            onClick={() => setTab("dashboard")}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
