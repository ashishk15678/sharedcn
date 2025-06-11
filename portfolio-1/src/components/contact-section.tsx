import { CreativeCard } from "./creative-card"
import { MarkerText } from "./marker-text"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 relative">
      <div className="absolute inset-0 bg-black"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-white relative">
          <MarkerText color="orange">Get In Touch</MarkerText>
          <div className="absolute -bottom-3 right-0 w-8 h-1 bg-orange-500 transform -rotate-12"></div>
        </h2>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-orange-300 relative">
              Let's Connect
              <span className="absolute -bottom-1 left-0 w-16 h-0.5 bg-orange-500"></span>
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm font-light">
              I'm always interested in hearing about new opportunities and projects. Whether you have a question or just
              want to say hi, feel free to reach out!
            </p>

            <div className="space-y-4">
              <CreativeCard variant="tilted" className="p-4 flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300 text-sm">ashish@example.com</span>
              </CreativeCard>
              <CreativeCard variant="highlighted" className="p-4 flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </CreativeCard>
              <CreativeCard variant="torn" className="p-4 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300 text-sm">San Francisco, CA</span>
              </CreativeCard>
            </div>
          </div>

          <CreativeCard variant="highlighted" className="p-6">
            <h4 className="text-lg font-semibold mb-4 text-white relative">
              <MarkerText color="yellow">Send Message</MarkerText>
            </h4>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 text-sm"
                />
                <Input
                  placeholder="Last Name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 text-sm"
                />
              </div>
              <Input
                placeholder="Email"
                type="email"
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 text-sm"
              />
              <Input
                placeholder="Subject"
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 text-sm"
              />
              <Textarea
                placeholder="Your message..."
                rows={5}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 text-sm resize-none"
              />
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-black text-sm">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CreativeCard>
        </div>
      </div>
    </section>
  )
}
