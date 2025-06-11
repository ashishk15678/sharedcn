import { CreativeCard } from "./creative-card"
import { MarkerText } from "./marker-text"

export function AboutSection() {
  return (
    <section id="about" className="py-20 relative">
      <div className="absolute inset-0 bg-black"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-white relative">
          <MarkerText color="orange">About Me</MarkerText>
          <div className="absolute -top-1 -left-2 w-4 h-4 border-2 border-orange-500 rounded-full"></div>
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-orange-300 relative">
              Hello, I'm Ashish
              <span className="absolute -bottom-1 left-0 w-16 h-0.5 bg-orange-500"></span>
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm font-light">
              I'm a passionate full-stack developer with over 3 years of experience creating digital solutions that make
              a difference. I love turning complex problems into simple, beautiful designs.
            </p>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm font-light">
              When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or
              sharing my knowledge with the developer community.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <CreativeCard variant="tilted" className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">50+</div>
                  <div className="text-xs text-gray-500">Projects Completed</div>
                </div>
              </CreativeCard>
              <CreativeCard variant="torn" className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">3+</div>
                  <div className="text-xs text-gray-500">Years Experience</div>
                </div>
              </CreativeCard>
            </div>
          </div>
          <div className="relative">
            <CreativeCard className="w-full h-96 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5"></div>
              <div className="text-4xl font-bold text-gray-600/50">PHOTO</div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-orange-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-orange-500/15 rounded-full blur-xl"></div>
              <div className="absolute top-8 left-8 w-2 h-8 bg-orange-500/30 transform rotate-45"></div>
            </CreativeCard>
          </div>
        </div>
      </div>
    </section>
  )
}
