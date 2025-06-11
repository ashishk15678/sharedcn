"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Code,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { MotionDivProps } from "@/types/motion";
import Image from "next/image";
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
import { AppleButton } from "../components";
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

const FEATURED_LINKS = [
  {
    id: 1,
    name: "Astromvp",
    url: "https://astromvp.resources.ashish.services",
    color: "bg-red-500",
    icon: "astromvp",
    description: "A modern MVP platform for startups",
    image: "/astro-mvp.png",
  },
  {
    id: 2,
    name: "Portfolio-1",
    url: "https://portfolio-1.resources.ashish.services",
    color: "bg-blue-500",
    icon: "resources",
    description: "Curated resources for developers",
    image: "/portfolio-1.png",
  },
  {
    id: 3,
    name: "Build web",
    url: "https://web.ashish.services",
    color: "bg-green-500",
    icon: "tools",
    description: "It just exists",
    image: "/build-web.png",
  },
];

export default function Page() {
  const [shouldLoadResources, setShouldLoadResources] = useState(false);
  const [isInResourcesView, setIsInResourcesView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % FEATURED_LINKS.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + FEATURED_LINKS.length) % FEATURED_LINKS.length
    );
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white relative flex flex-col items-center justify-center antialiased">
        {/* Live Links Section - Moved to top */}
        <div className="relative w-full flex flex-col items-center justify-center mt-40">
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

              {/* Quote */}
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                // @ts-ignore
                className="relative mt-20 max-w-3xl mx-auto"
              >
                <section className="w-full py-12  relative z-30">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        // @ts-ignore
                        className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-4"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Live Designs
                      </motion.div>
                    </div>

                    {/* Carousel */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      // @ts-ignore
                      className="relative max-w-4xl mx-auto"
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-zinc-100/20 ring ring-zinc-100 backdrop-blur-lg shadow-xl">
                        {/* Navigation Buttons */}
                        <button
                          onClick={prevSlide}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>

                        {/* Slides */}
                        <div
                          ref={carouselRef}
                          className="flex transition-transform duration-500 ease-out"
                          style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                          }}
                        >
                          {FEATURED_LINKS.map((link) => (
                            <div
                              key={link.id}
                              className="w-full flex-shrink-0 p-16"
                            >
                              <div className="grid md:grid-cols-2 gap-6 items-center">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-3">
                                    <h3 className="ml-8 text-xl font-bold text-gray-900">
                                      {link.name}
                                    </h3>
                                  </div>
                                  <p className="text-gray-600 flex justify-center">
                                    {link.description}
                                  </p>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    Visit Project
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </div>
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <Image
                                      src={link.image}
                                      alt={link.name}
                                      className="w-full h-full object-cover"
                                      width={800}
                                      height={200}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {FEATURED_LINKS.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                currentSlide === index
                                  ? "bg-blue-600 w-4"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* View All Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        // @ts-ignore
                        className="text-center mt-6"
                      ></motion.div>
                    </motion.div>
                  </div>
                </section>

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
