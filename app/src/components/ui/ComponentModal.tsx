import React, { useEffect, useRef } from "react";
import { ComponentData } from "@/components/resources/Resources";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ComponentModalProps {
  component: ComponentData;
  onClose: () => void;
}

const ComponentModal: React.FC<ComponentModalProps> = ({
  component,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        // @ts-ignore
        className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 overflow-hidden"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          // @ts-ignore
          className="bg-white/80 backdrop-blur-md rounded-xl w-full max-w-3xl mx-4 shadow-xl border border-white/20 flex flex-col max-h-[90vh]"
        >
          {/* Fixed Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-900">
                {component.title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fixed Component Preview */}
          <div className="p-6 border-b border-gray-200/50 bg-gray-50/50">
            <div className="p-8 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 flex items-center justify-center">
              <div className="w-full flex items-center justify-center">
                {component.component}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600">{component.description}</p>
            </div>
          </div>

          {/* Scrollable Code Section */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg border border-gray-200/50">
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{component.code}</code>
                </pre>
              </div>
            </div>

            {/* Tags at the bottom of scrollable area */}
            <div className="flex gap-2 mt-4">
              {component.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100/50 backdrop-blur-sm rounded-full text-xs border border-gray-200/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComponentModal;
