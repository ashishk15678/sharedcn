"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Sparkles } from "lucide-react"
import { CreativeCard } from "./creative-card"
import { MarkerText } from "./marker-text"
import { useState, useEffect } from "react"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5 bg-repeat"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-500/15 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-orange-500/30 text-xs text-orange-300">
            <Sparkles className="h-3 w-3" />
            Available for new opportunities
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-white relative">
            <MarkerText color="orange">ASHISH</MarkerText>
            <div className="absolute -top-2 -right-4 w-8 h-1 bg-orange-500 rounded-full transform rotate-12"></div>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-3 font-light">
            <span className="relative">
              Full Stack Developer & Designer
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500/50 transform -skew-x-12"></span>
            </span>
          </p>
          <p className="text-sm text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
            Passionate about creating beautiful and functional web experiences. Specializing in full-stack development
            with a keen eye for design. Currently available for freelance projects and collaborations.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Button
              size="lg"
              className="group bg-orange-500 hover:bg-orange-600 text-black border-0 text-sm font-medium"
            >
              Get In Touch
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white text-sm font-medium"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          </div>

          <CreativeCard variant="highlighted" className="p-6 max-w-md mx-auto">
            <div className="text-xs text-gray-400 mb-2">Quick Stats</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-orange-400">50+</div>
                <div className="text-xs text-gray-500">Projects</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-400">3+</div>
                <div className="text-xs text-gray-500">Years</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-400">165</div>
                <div className="text-xs text-gray-500">LeetCode</div>
              </div>
            </div>
          </CreativeCard>
        </div>
      </div>
    </section>
  )
}
