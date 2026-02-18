"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthSuccessOverlayProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
  /** Duration in ms before calling onComplete. Default: 2000 */
  duration?: number;
  /** If true, renders as a fixed fullscreen overlay. Default: false (inline within card). */
  fullscreen?: boolean;
}

function SuccessContent({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.1,
      }}
      className="flex flex-col items-center gap-4"
    >
      {/* Animated circle + checkmark */}
      <div className="relative">
        {/* Ripple rings */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="absolute inset-0 rounded-full bg-emerald-400/30"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0.4 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="absolute inset-0 rounded-full bg-emerald-400/20"
        />

        {/* Main circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            delay: 0.15,
          }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
        >
          {/* SVG Checkmark */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-10 h-10"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: 0.4,
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-xl font-bold text-zinc-800">{message}</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Redirecting you now...
        </p>
      </motion.div>

      {/* Progress dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-1.5 mt-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export function AuthSuccessOverlay({
  show,
  message = "Welcome back!",
  onComplete,
  duration = 2000,
  fullscreen = false,
}: AuthSuccessOverlayProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onComplete]);

  // Fullscreen mode — fixed overlay like before
  if (fullscreen) {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm"
          >
            <SuccessContent message={message} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Inline mode — renders within the parent card, same size
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="auth-success-inline"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center justify-center py-8"
        >
          <SuccessContent message={message} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
