import { CreativeCard } from "./creative-card"
import { MarkerText } from "./marker-text"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    github: "#",
    live: "#",
    variant: "tilted" as const,
  },
  {
    title: "Task Management App",
    description: "Collaborative task management application with real-time updates and team collaboration features.",
    tech: ["React", "Node.js", "Socket.io", "MongoDB"],
    github: "#",
    live: "#",
    variant: "highlighted" as const,
  },
  {
    title: "Weather Dashboard",
    description: "Beautiful weather dashboard with location-based forecasts and interactive charts.",
    tech: ["React", "TypeScript", "Chart.js", "Weather API"],
    github: "#",
    live: "#",
    variant: "torn" as const,
  },
  {
    title: "Portfolio Website",
    description: "Modern portfolio website with dark mode, animations, and responsive design.",
    tech: ["Next.js", "TailwindCSS", "Framer Motion"],
    github: "#",
    live: "#",
    variant: "default" as const,
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 relative">
      <div className="absolute inset-0 bg-black"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-white relative">
          <MarkerText color="orange">Featured Projects</MarkerText>
          <div className="absolute -bottom-2 -right-4 w-8 h-8 border border-orange-500/30 rounded-full"></div>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <CreativeCard key={index} variant={project.variant} className="p-6 group relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white relative">
                    {project.title}
                    {index % 2 === 0 && (
                      <span className="absolute -top-1 -right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
                    )}
                  </h3>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10" asChild>
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-white/20 text-gray-300 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              {index % 3 === 1 && (
                <div className="absolute bottom-2 left-2 w-4 h-1 bg-orange-500/40 transform -rotate-12"></div>
              )}
            </CreativeCard>
          ))}
        </div>
      </div>
    </section>
  )
}
