"use client";

import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b"
    >
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Rocket className="h-6 w-6 text-pink-500" />
          </motion.div>
          <span className="font-bold text-xl">ASTROMVP</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-gray-600 hover:text-gray-900 hover:underline underline-offset-4">Features</Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 hover:underline underline-offset-4">Pricing</Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 hover:underline underline-offset-4">Testimonials</Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 hover:underline underline-offset-4">Contact</Link>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full">
            Get Started Now
          </Button>
        </motion.div>
      </nav>
    </motion.header>
  );
}