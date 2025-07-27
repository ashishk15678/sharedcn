"use client";

import React, {
  useState,
  useMemo,
  Suspense,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Search,
  Trash2,
  Monitor,
  Tablet,
  Smartphone,
  Menu,
  X,
  Home,
  MessageSquare,
  User,
  Settings,
  DeleteIcon,
  CheckCircle,
  AlertCircle,
  Copy,
  PlusSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { components } from "@/components";

// --- UTILITY FUNCTIONS (like lib/utils) ---
const cn = (...classes) => classes.filter(Boolean).join(" ");

const ContextMenu = ({ x, y, onClone, onCopy, onRemove, onClose }) => {
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      style={{ top: y, left: x }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute z-50 bg-white dark:bg-zinc-800 shadow-xl rounded-lg border border-zinc-200 dark:border-zinc-700 w-40"
    >
      <button
        onClick={onClone}
        className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-t-lg"
      >
        <PlusSquare size={14} /> Clone
      </button>
      <button
        onClick={onCopy}
        className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
      >
        <Copy size={14} /> Copy
      </button>
      <div className="h-[1px] bg-zinc-200 dark:bg-zinc-700 my-1"></div>
      <button
        onClick={onRemove}
        className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-b-lg"
      >
        <Trash2 size={14} /> Remove
      </button>
    </motion.div>
  );
};

const ResizableFrame = ({ children, size, onResize, ...motionProps }) => {
  return (
    <motion.div
      {...motionProps}
      className="absolute p-1 bg-white/20 dark:bg-zinc-800/20 border border-dashed border-blue-500 rounded-lg shadow-lg group"
      style={{ width: size.width, height: size.height }}
    >
      <div className="w-full h-full overflow-auto bg-white dark:bg-zinc-900 rounded-md p-2">
        {children}
      </div>
      <motion.div
        className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-600 rounded-full cursor-se-resize border-2 border-white dark:border-zinc-900 z-10 opacity-50 group-hover:opacity-100 transition-opacity"
        drag="x,y"
        dragMomentum={false}
        onDrag={onResize}
      />
    </motion.div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function PlaygroundPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [canvasComponents, setCanvasComponents] = useState([]);
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [contextMenu, setContextMenu] = useState(null);
  const canvasRef = useRef(null);

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData("text/plain", component.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.clientX > window.innerWidth * 0.25 && canvasRef.current) {
      const componentId = e.dataTransfer.getData("text/plain");
      const component = components.find((c) => c.id === componentId);
      if (!component) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: e.clientX - canvasRect.left - 175, // Center the drop point
        y: e.clientY - canvasRect.top - 125,
      };
      const size = { width: 350, height: 250 }; // Default size
      setCanvasComponents((prev) => [
        ...prev,
        { ...component, instanceId: Date.now(), position, size },
      ]);
    }
  };

  const handleContextMenu = (e, instanceId) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, instanceId });
  };

  const closeContextMenu = () => setContextMenu(null);

  const updateComponentProps = (instanceId, newProps) => {
    setCanvasComponents((prev) =>
      prev.map((c) => (c.instanceId === instanceId ? { ...c, ...newProps } : c))
    );
  };

  const cloneComponent = () => {
    const componentToClone = canvasComponents.find(
      (c) => c.instanceId === contextMenu.instanceId
    );
    if (componentToClone) {
      const newPosition = {
        x: componentToClone.position.x + 20,
        y: componentToClone.position.y + 20,
      };
      setCanvasComponents((prev) => [
        ...prev,
        { ...componentToClone, instanceId: Date.now(), position: newPosition },
      ]);
    }
    closeContextMenu();
  };

  const copyComponent = () => {
    const componentToCopy = canvasComponents.find(
      (c) => c.instanceId === contextMenu.instanceId
    );
    if (componentToCopy && componentToCopy.code) {
      navigator.clipboard.writeText(componentToCopy.code);
    }
    closeContextMenu();
  };

  const removeComponent = () => {
    setCanvasComponents((prev) =>
      prev.filter((c) => c.instanceId !== contextMenu.instanceId)
    );
    closeContextMenu();
  };

  const filteredComponents = useMemo(() => {
    if (!searchQuery) return components;
    const query = searchQuery.toLowerCase();
    return components.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        (c.tags && c.tags.some((t) => t.toLowerCase().includes(query)))
    );
  }, [searchQuery]);

  const deviceWidths = { desktop: "100%", tablet: "768px", mobile: "375px" };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 min-h-screen font-sans text-zinc-800 dark:text-zinc-200">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <aside className="w-full md:w-1/4 lg:w-1/5 h-full flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col">
          <h2 className="text-lg font-bold mb-4 px-2">Components</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-grow overflow-y-auto -mr-2 pr-2">
            {filteredComponents.map((component) => (
              <div
                key={component.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, component)}
                className="p-3 rounded-lg cursor-grab active:cursor-grabbing hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <h3 className="font-semibold text-sm">{component.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {component.description}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Side: Interactive Playground */}
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
          <div className="flex-shrink-0 flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Playground</h1>
            <div className="flex items-center gap-2 p-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`p-2 rounded-md ${
                  deviceMode === "desktop"
                    ? "bg-white dark:bg-zinc-700 shadow"
                    : "hover:bg-zinc-300/50"
                }`}
              >
                <Monitor size={20} />
              </button>
              <button
                onClick={() => setDeviceMode("tablet")}
                className={`p-2 rounded-md ${
                  deviceMode === "tablet"
                    ? "bg-white dark:bg-zinc-700 shadow"
                    : "hover:bg-zinc-300/50"
                }`}
              >
                <Tablet size={20} />
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`p-2 rounded-md ${
                  deviceMode === "mobile"
                    ? "bg-white dark:bg-zinc-700 shadow"
                    : "hover:bg-zinc-300/50"
                }`}
              >
                <Smartphone size={20} />
              </button>
            </div>
          </div>
          <div className="flex-grow flex justify-center items-center bg-zinc-100 dark:bg-zinc-800/50 rounded-xl overflow-hidden">
            <motion.div
              className="w-full h-full bg-white dark:bg-zinc-900 shadow-inner-lg"
              animate={{ maxWidth: deviceWidths[deviceMode] }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div
                ref={canvasRef}
                className="p-4 m-4 h-[calc(100%-2rem)] border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg relative overflow-auto"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <AnimatePresence>
                  {canvasComponents.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-zinc-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <p className="font-semibold">
                        Drag & Drop Components Here
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {canvasComponents.map((comp) => (
                  <ResizableFrame
                    key={comp.instanceId}
                    size={comp.size}
                    onResize={(e, info) => {
                      updateComponentProps(comp.instanceId, {
                        size: {
                          width: Math.max(200, comp.size.width + info.delta.x),
                          height: Math.max(
                            150,
                            comp.size.height + info.delta.y
                          ),
                        },
                      });
                    }}
                    initial={{ x: comp.position.x, y: comp.position.y }}
                    onContextMenu={(e) => handleContextMenu(e, comp.instanceId)}
                    drag
                    dragConstraints={canvasRef}
                    dragMomentum={false}
                    onDragEnd={(e, info) => {
                      updateComponentProps(comp.instanceId, {
                        position: {
                          x: comp.position.x + info.offset.x,
                          y: comp.position.y + info.offset.y,
                        },
                      });
                    }}
                  >
                    <Suspense
                      fallback={
                        <div className="w-full h-full bg-zinc-200 animate-pulse rounded-lg" />
                      }
                    >
                      {comp.component}
                    </Suspense>
                  </ResizableFrame>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
        <AnimatePresence>
          {contextMenu && (
            <ContextMenu
              {...contextMenu}
              onClone={cloneComponent}
              onCopy={copyComponent}
              onRemove={removeComponent}
              onClose={closeContextMenu}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
