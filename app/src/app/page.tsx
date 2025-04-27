"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Code, X } from "lucide-react";
import type { MotionDivProps } from "@/types/motion";
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";

import dynamic from "next/dynamic";
import { ResourcesLoadingFallback } from "@/components/utils";
import { BackgroundBeams } from "@/components/layout/BackgroundBeams";
import { LiveLinksModal } from "@/components";
// Dynamically import Resources with loading fallback
const DynamicResources = dynamic(
  () =>
    import("@/components/resources/ResourcesComponent").then(
      (mod) => mod.ResourcesComponent
    ),
  {
    loading: () => <ResourcesLoadingFallback />,
    ssr: false, // Disable SSR for Resources component
  }
);

export default function Page() {
  const [shouldLoadResources, setShouldLoadResources] = useState(false);
  const [isInResourcesView, setIsInResourcesView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Intersection Observer to detect when Resources section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInResourcesView(true);
          setShouldLoadResources(true);
        }
      },
      {
        rootMargin: "100px", // Start loading slightly before the section is in view
      }
    );

    const resourcesSection = document.getElementById("resources");
    if (resourcesSection) {
      observer.observe(resourcesSection);
    }

    return () => observer.disconnect();
  }, []);

  // Handle scroll to resources
  const handleScrollToResources = () => {
    setShouldLoadResources(true); // Start loading when user clicks the button
    document
      .getElementById("resources")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="min-h-screen bg-white relative flex flex-col items-center justify-center antialiased">
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Background effects */}
          <BackgroundBeams />

          {/* Content */}
          <div className="relative z-20 w-full max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              // @ts-ignore
              className="text-center space-y-12"
            >
              {/* Pill-shaped label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                // @ts-ignore
                className="mx-auto"
              >
                <span className="relative inline-flex items-center px-6 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium group">
                  <span className="absolute -inset-0.5 animate-pulse rounded-full bg-green-100/40" />
                  <Sparkles className="w-4 h-4 mr-2" />
                  Empowering Developers Worldwide
                </span>
              </motion.div>

              {/* Main heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                // @ts-ignore
                className="relative"
              >
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-gray-900">
                  <span className="inline-block">
                    Helping Others
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-[0.85]" />
                  </span>
                  <br />
                  <span className="text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-600 mt-4 block">
                    One Line of Code at a Time
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                // @ts-ignore
                className="mx-auto max-w-2xl text-xl text-gray-600 leading-relaxed"
              >
                Join our mission to create a more inclusive tech community.
                Share knowledge, discover resources, and grow together with
                developers from around the globe.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                // @ts-ignore
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button
                  onClick={handleScrollToResources}
                  className="group relative px-8 py-4 rounded-full bg-green-600 text-white font-medium text-xl cursor-pointer shadow-md hover:shadow-none shadow-green-600 transition-all duration-200 flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 rounded-full bg-gray-100 text-gray-900 font-medium text-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Live Links
                </button>
              </motion.div>

              {/* Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                // @ts-ignore
                className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16"
              >
                {[
                  { value: "10K+", label: "Developers" },
                  { value: "500+", label: "Resources" },
                  { value: "50+", label: "Countries" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.03)] hover:shadow-[0_0_30px_rgba(0,0,0,0.07)] transition-shadow"
                  >
                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 mt-2">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Quote */}
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                // @ts-ignore
                className="relative mt-20 max-w-3xl mx-auto"
              >
                <div className="relative rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 p-8">
                  <div className="absolute -top-4 left-8">
                    <span className="text-4xl">💡</span>
                  </div>
                  <p className="text-xl text-gray-700 italic">
                    "The greatest reward in becoming a developer is not in the
                    code we create, but in the developers we become by coding
                    it."
                  </p>
                  <footer className="mt-4 text-gray-600 font-medium">
                    - The Developer Community
                  </footer>
                </div>
              </motion.blockquote>
            </motion.div>
          </div>
        </div>
      </div>
      <div
        id="resources"
        className="h-screen w-screen bg-gradient-to-b from-white to-green-200"
      >
        <Suspense fallback={<ResourcesLoadingFallback />}>
          {shouldLoadResources && <DynamicResources />}
        </Suspense>
      </div>
      <LiveLinksModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
