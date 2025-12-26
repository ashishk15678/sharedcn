import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-black">SharedCN</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#leaderboard" className="text-gray-600 hover:text-black transition-colors">
                Leaderboard
              </Link>
              <Link href="/pricing" className="text-black font-medium">
                Pricing
              </Link>
              <Button variant="ghost" className="text-gray-600 hover:text-black">
                Login
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800">Create profile</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-normal mb-4 text-black leading-tight">Simple pricing for</h1>
          <h2 className="text-5xl md:text-6xl font-light text-gray-400 italic mb-8 leading-tight">every developer</h2>
          <p className="text-xl text-gray-600 mb-8">Start free, scale as you grow. No hidden fees, no surprises.</p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
                <CardTitle className="text-2xl mb-2 text-black">Free</CardTitle>
                <div className="text-4xl font-bold mb-2 text-black">
                  $0
                  <span className="text-lg text-gray-400 font-normal">/month</span>
                </div>
                <p className="text-gray-600">Perfect for getting started</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Up to 10 components</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Public repositories only</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Community support</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Basic CLI tools</span>
                  </div>
                </div>
                <Button className="w-full mt-8 bg-gray-100 hover:bg-gray-200 text-black border border-gray-200">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-white border-2 border-yellow-400 rounded-2xl shadow-lg relative scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-400 text-black px-4 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <Zap className="w-8 h-8 text-yellow-500" />
                </div>
                <CardTitle className="text-2xl mb-2 text-black">Pro</CardTitle>
                <div className="text-4xl font-bold mb-2 text-black">
                  $19
                  <span className="text-lg text-gray-400 font-normal">/month</span>
                </div>
                <p className="text-gray-600">For serious developers</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="text-gray-700">Unlimited components</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="text-gray-700">Private repositories</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="text-gray-700">Priority support</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="text-gray-700">Advanced CLI tools</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="text-gray-700">Team collaboration</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="text-gray-700">Analytics dashboard</span>
                  </div>
                </div>
                <Button className="w-full mt-8 bg-black text-white hover:bg-gray-800">Start Pro Trial</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <Crown className="w-8 h-8 text-purple-500" />
                </div>
                <CardTitle className="text-2xl mb-2 text-black">Enterprise</CardTitle>
                <div className="text-4xl font-bold mb-2 text-black">Custom</div>
                <p className="text-gray-600">For large organizations</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">Everything in Pro</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">Custom integrations</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">Dedicated support</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">SLA guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">On-premise deployment</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">Custom training</span>
                  </div>
                </div>
                <Button className="w-full mt-8 bg-gray-100 hover:bg-gray-200 text-black border border-gray-200">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-8">
            <div className="flex space-x-8 text-gray-400 text-sm">
              <Link href="#" className="hover:text-black transition-colors">
                X / fka Twitter
              </Link>
              <Link href="#" className="hover:text-black transition-colors">
                Contact
              </Link>
              <Link href="#" className="hover:text-black transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-black transition-colors">
                Terms of Use
              </Link>
            </div>
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
