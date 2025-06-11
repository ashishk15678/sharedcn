import { CreativeCard } from "./creative-card"
import { MarkerText } from "./marker-text"
import { Badge } from "@/components/ui/badge"

const skillCategories = [
  {
    title: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "SQL", "Rust"],
    variant: "tilted" as const,
  },
  {
    title: "Frameworks",
    skills: ["React", "Next.js", "TailwindCSS", "Express.js"],
    variant: "highlighted" as const,
  },
  {
    title: "Tools",
    skills: ["MongoDB", "PostgreSQL", "Prisma"],
    variant: "torn" as const,
  },
  {
    title: "Platforms",
    skills: ["Vercel", "Docker", "GitHub"],
    variant: "default" as const,
  },
  {
    title: "Software",
    skills: ["VS Code", "Postman", "Figma", "Cursor"],
    variant: "tilted" as const,
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 relative">
      <div className="absolute inset-0 bg-black"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-white relative">
          <MarkerText color="orange">Technical Skills</MarkerText>
          <div className="absolute -top-2 right-0 w-6 h-1 bg-orange-500 transform rotate-12"></div>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {skillCategories.map((category, index) => (
            <CreativeCard key={category.title} variant={category.variant} className="p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-4 text-white relative">
                  {category.title}
                  {index % 2 === 0 && <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-orange-500/60"></span>}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-white/10 text-gray-300 border-white/20 text-xs hover:bg-orange-500/20 hover:text-orange-300 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              {index % 3 === 0 && <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500/30 rounded-full"></div>}
            </CreativeCard>
          ))}
        </div>

        <CreativeCard variant="highlighted" className="p-6 max-w-2xl mx-auto">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-4 text-center text-white relative">
              <MarkerText color="yellow">LeetCode Stats</MarkerText>
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Problems Solved</div>
                <div className="text-2xl font-bold text-orange-400">165</div>
                <div className="text-xs text-yellow-500">★ +1</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Global Ranking</div>
                <div className="text-2xl font-bold text-orange-400">#748052</div>
              </div>
            </div>
          </div>
        </CreativeCard>
      </div>
    </section>
  )
}
