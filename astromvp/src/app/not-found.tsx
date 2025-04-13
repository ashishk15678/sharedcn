

"use client";

import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-pink-200  to-pink-100/300">

      <div className="relative w-full max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Error Code */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative inline-block"
          >
            <span className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-600">
              404
            </span>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold text-gray-900">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Looks like you've ventured into uncharted territory.
              Don't worry, even the best explorers sometimes get lost.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 py-6 text-lg flex items-center gap-2">
                <Home className="w-5 h-5" />
                Back to Home
              </Button>
            </Link>
            <Button
              onClick={() => window.history.back()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full px-8 py-6 text-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -inset-[10px] opacity-50">
              {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-pink-200 to-pink-300 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-r from-purple-100 to-purple-200 rounded-full blur-3xl" /> */}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}