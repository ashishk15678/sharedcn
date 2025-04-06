"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Founder, TechStart",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      content: "AstroMVP delivered our platform in just 2 weeks. The quality exceeded our expectations, and we were able to start onboarding users immediately."
    },
    {
      name: "Michael Chen",
      role: "CEO, DataFlow",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      content: "The fixed pricing model gave us peace of mind. We knew exactly what we were getting and when we would get it. Highly recommended!"
    },
    {
      name: "Emily Rodriguez",
      role: "CTO, HealthTech",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      content: "Working with AstroMVP was a game-changer. Their expertise in MVP development helped us secure our seed round faster than expected."
    }
  ];

  return (
    <div className="gradient-bg py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">What Our Clients Say</h1>
          <p className="text-gray-600">Join hundreds of satisfied founders who trusted AstroMVP</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white rounded-2xl shadow-lg p-8 hover-lift"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">&ldquo;{testimonial.content}&rdquo;</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}