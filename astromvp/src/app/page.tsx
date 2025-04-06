"use client";

import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/ui/testimonials";

export default function Home() {
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="gradient-bg">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative">
          {/* <motion.button
            className="absolute left-0 top-1/4 bg-white rounded-lg p-2 shadow-lg"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-4 w-4" />
          </motion.button>
          <motion.button
            className="absolute right-0 top-3/4 bg-white rounded-lg p-2 shadow-lg"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-4 w-4" />
          </motion.button> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block px-4 py-1 bg-pink-50 rounded-full text-pink-500 text-sm mb-6"
            >
              MVP Development Process
            </motion.div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Most founders waste<br />
              $50k on their MVP.<br />
              You won&apos;t 🤘
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              You handle the business side. We handle the entire tech build.<br />
              Fixed price. No surprises. Ready in 2 weeks. Built by the same team<br />
              trusted by 50+ funded startups.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 py-6 text-lg">
                Book a friendly chat
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          ref={featuresRef}
          variants={container}
          initial="hidden"
          animate={featuresInView ? "show" : "hidden"}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Lightning Fast Delivery",
              description: "Get your MVP up and running in just 2 weeks. No compromises on quality."
            },
            {
              title: "Fixed Pricing",
              description: "Know exactly what you're paying. No hidden costs or surprise fees."
            },
            {
              title: "Expert Team",
              description: "Work with developers who've built successful startups before."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white p-6 rounded-xl shadow-lg hover-lift"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Build Your MVP?</h2>
          <p className="text-gray-600 mb-8">
            Join the hundreds of founders who've successfully launched with AstroMVP
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 py-4">
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>
 <Pricing />
 <Testimonials />
    </div>
  );
}