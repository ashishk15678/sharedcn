"use client"

import { Home, User, Code, Briefcase, FileText, Mail, Github, Linkedin, Twitter, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Skills", href: "#skills", icon: Code },
  { name: "Projects", href: "#projects", icon: Briefcase },
  { name: "Resume", href: "#resume", icon: FileText },
  { name: "Play", href: "#play", icon: Gamepad2 },
  { name: "Contact", href: "#contact", icon: Mail },
]

const social = [
  { name: "GitHub", href: "#", icon: Github },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Twitter", href: "#", icon: Twitter },
]

export function Sidebar() {
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map((item) => item.href.substring(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getActiveIndex = () => {
    return navigation.findIndex((item) => item.href.substring(1) === activeSection)
  }

  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-16 bg-black/90 backdrop-blur-xl border-r border-orange-500/20 flex flex-col items-center py-4">
      <div className="flex flex-col items-center space-y-4 flex-1">
        <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 relative">
          <span className="text-black font-bold text-xs">A</span>
          <div className="absolute -inset-1 bg-orange-500/20 rounded-xl blur-sm"></div>
        </div>

        <nav className="flex flex-col space-y-1">
          {navigation.map((item, index) => {
            const isActive = activeSection === item.href.substring(1)
            const activeIndex = getActiveIndex()
            const shouldDrop = index <= activeIndex

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`p-2.5 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-orange-500/20 text-orange-400 scale-110"
                    : shouldDrop
                      ? "hover:bg-white/10 hover:text-orange-300 hover:scale-105 text-orange-200/70"
                      : "hover:bg-white/10 hover:text-white hover:scale-105 text-white/50"
                }`}
                style={{
                  transform: shouldDrop ? `translateY(${index * 2}px)` : "translateY(0)",
                }}
                title={item.name}
              >
                <item.icon className="h-4 w-4" />
                {isActive && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50" />
                )}
                <span className="absolute left-full ml-3 px-2 py-1 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-orange-500/20">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <ThemeToggle />
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent my-2" />
        {social.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-orange-300 transition-all duration-300 hover:scale-110"
            title={item.name}
          >
            <item.icon className="h-3.5 w-3.5" />
          </Link>
        ))}
      </div>
    </div>
  )
}
