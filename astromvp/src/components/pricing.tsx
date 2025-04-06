"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
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
    <div className="gradient-bg py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-600">Choose the perfect plan for your MVP needs</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              name: "Starter MVP",
              price: "$5,999",
              description: "Perfect for validating your idea",
              features: [
                "Core Feature Implementation",
                "Basic User Authentication",
                "Responsive Design",
                "2 Week Delivery",
                "1 Month Support"
              ]
            },
            {
              name: "Pro MVP",
              price: "$9,999",
              description: "For serious founders ready to scale",
              features: [
                "All Starter Features",
                "Advanced Authentication",
                "Admin Dashboard",
                "API Integration",
                "3 Months Support"
              ]
            },
            {
              name: "Enterprise",
              price: "Custom",
              description: "Tailored solution for complex needs",
              features: [
                "Custom Feature Set",
                "Priority Development",
                "Dedicated Team",
                "Custom Timeline",
                "1 Year Support"
              ]
            }
          ].map((plan, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white rounded-2xl shadow-lg p-8 hover-lift"
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-pink-500 mb-4">{plan.price}</div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full">
                Get Started
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}