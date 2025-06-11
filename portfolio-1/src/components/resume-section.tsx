import { CreativeCard } from "./creative-card"
import { MarkerText } from "./marker-text"
import { Button } from "@/components/ui/button"
import { Download, Calendar, MapPin } from "lucide-react"

const experience = [
  {
    title: "Senior Full Stack Developer",
    company: "Tech Solutions Inc.",
    period: "2022 - Present",
    location: "Remote",
    description: "Led development of multiple client projects using React, Node.js, and cloud technologies.",
  },
  {
    title: "Frontend Developer",
    company: "Digital Agency",
    period: "2021 - 2022",
    location: "New York, NY",
    description: "Developed responsive web applications and collaborated with design teams.",
  },
  {
    title: "Junior Developer",
    company: "StartupXYZ",
    period: "2020 - 2021",
    location: "San Francisco, CA",
    description: "Built and maintained web applications using modern JavaScript frameworks.",
  },
]

const education = [
  {
    degree: "Bachelor of Computer Science",
    school: "University of Technology",
    period: "2016 - 2020",
    location: "California, USA",
  },
]

export function ResumeSection() {
  return (
    <section id="resume" className="py-20 relative">
      <div className="absolute inset-0 bg-black"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-white relative">
            <MarkerText color="orange">Resume</MarkerText>
            <div className="absolute -top-3 right-0 w-6 h-6 border-2 border-orange-500/30 rounded-full"></div>
          </h2>
          <Button className="bg-orange-500 hover:bg-orange-600 text-black text-sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-orange-300 relative">
              Experience
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-orange-500"></span>
            </h3>
            <div className="space-y-6">
              {experience.map((job, index) => (
                <CreativeCard key={index} variant={index % 2 === 0 ? "tilted" : "highlighted"} className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-1 relative">
                    {job.title}
                    {index === 0 && (
                      <span className="absolute -top-1 -right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
                    )}
                  </h4>
                  <div className="text-orange-400 font-medium mb-2 text-sm">{job.company}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {job.period}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{job.description}</p>
                </CreativeCard>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-orange-300 relative">
              Education
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-orange-500"></span>
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <CreativeCard key={index} variant="torn" className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-1">{edu.degree}</h4>
                  <div className="text-orange-400 font-medium mb-2 text-sm">{edu.school}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {edu.period}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {edu.location}
                    </div>
                  </div>
                </CreativeCard>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4 text-orange-300 relative">
                <MarkerText color="yellow">Certifications</MarkerText>
              </h4>
              <CreativeCard variant="highlighted" className="p-6">
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• AWS Certified Developer Associate</li>
                  <li>• Google Cloud Professional Developer</li>
                  <li>• MongoDB Certified Developer</li>
                </ul>
              </CreativeCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
