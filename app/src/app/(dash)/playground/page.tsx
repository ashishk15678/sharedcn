"use client";

import React, {
  useState,
  useMemo,
  Suspense,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from "react";

import {
  Search,
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
  Send,
  Layout,
  Type,
  Palette,
  Image as ImageIcon,
  Maximize,
  Trash2,
  Copy,
  PlusSquare,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- COMPONENT DEFINITIONS ---
const GradientButton = ({ label = "Gradient Button" }) => (
  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity w-full h-full flex items-center justify-center text-sm">
    {label}
  </button>
);

const Card = ({
  children,
  padding = "p-4",
}: {
  children: ReactNode;
  padding: string;
}) => (
  <div
    className={`bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700 w-full h-full ${padding} flex flex-col gap-2 overflow-hidden`}
  >
    {children}
  </div>
);

const Heading = ({ text = "This is a Heading" }) => (
  <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{text}</h1>
);

const Paragraph = ({ text = "This is a paragraph." }) => (
  <p className="text-sm text-zinc-600 dark:text-zinc-400">{text}</p>
);

const Image = ({
  src = "https://placehold.co/600x400/e0e0e0/757575?text=Placeholder",
}) => (
  <div
    className="w-full h-full bg-cover bg-center rounded-lg"
    style={{ backgroundImage: `url(${src})` }}
  />
);

const components = [
  {
    id: "Card",
    name: "Card",
    description: "A container for content.",
    tags: ["container"],
    defaultProps: { padding: "p-4", children: [] },
    component: Card,
  },
  {
    id: "GradientButton",
    name: "GradientButton",
    description: "A beautiful gradient button.",
    tags: ["button"],
    defaultProps: { label: "Click Me" },
    component: GradientButton,
  },
  {
    id: "Heading",
    name: "Heading",
    description: "A title or heading text.",
    tags: ["text"],
    defaultProps: { text: "Main Title" },
    component: Heading,
  },
  {
    id: "Paragraph",
    name: "Paragraph",
    description: "A block of text.",
    tags: ["text"],
    defaultProps: { text: "This is a paragraph of text." },
    component: Paragraph,
  },
  {
    id: "Image",
    name: "Image",
    description: "An image element.",
    tags: ["media"],
    defaultProps: {
      src: "https://placehold.co/600x400/cccccc/222222?text=Image",
    },
    component: Image,
  },
];

const componentMap = { Card, GradientButton, Heading, Paragraph, Image };
const ComponentContext = createContext(componentMap);

// --- Resizable Frame Component ---
const ResizableFrame = React.memo(
  ({ comp, children, onSelect, onUpdate, isSelected, onContextMenu }: any) => {
    const handleResize = useCallback(
      (e: Event, info: any, corner: any) => {
        e.stopPropagation();
        let { width, height } = comp.size;
        let { x, y } = comp.position;

        if (corner.includes("r")) width = Math.max(50, width + info.delta.x);
        if (corner.includes("l")) {
          width = Math.max(50, width - info.delta.x);
          x += info.delta.x;
        }
        if (corner.includes("b")) height = Math.max(50, height + info.delta.y);
        if (corner.includes("t")) {
          height = Math.max(50, height - info.delta.y);
          y += info.delta.y;
        }
        onUpdate(comp.instanceId, {
          size: { width, height },
          position: { x, y },
        });
      },
      [comp.size, comp.position, onUpdate, comp.instanceId]
    );

    const handleDragEnd = useCallback(
      (e: Event, info: any) => {
        onUpdate(comp.instanceId, {
          position: {
            x: comp.position.x + info.offset.x,
            y: comp.position.y + info.offset.y,
          },
        });
      },
      [comp.position, onUpdate, comp.instanceId]
    );

    const corners = ["tl", "tr", "bl", "br"];
    const cornerCursors = [
      "nwse-resize",
      "nesw-resize",
      "nesw-resize",
      "nwse-resize",
    ];

    return (
      <motion.div
        key={comp.instanceId}
        className={`absolute group ${isSelected ? "z-10" : "z-0"}`}
        initial={{
          x: comp.position.x,
          y: comp.position.y,
          width: comp.size.width,
          height: comp.size.height,
        }}
        animate={{
          x: comp.position.x,
          y: comp.position.y,
          width: comp.size.width,
          height: comp.size.height,
        }}
        drag
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onMouseDownCapture={(e) => {
          e.stopPropagation();
          onSelect(comp.instanceId);
        }}
        onContextMenu={(e) => onContextMenu(e, comp.instanceId)}
      >
        <div
          className={`relative w-full h-full transition-colors duration-200 ${
            isSelected
              ? "border-2 border-blue-500"
              : "border-2 border-transparent hover:border-blue-500/30"
          }`}
        >
          {children}
          <AnimatePresence>
            {isSelected && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-t-md select-none"
                >
                  {comp.id}
                </motion.div>
                {corners.map((corner, i) => (
                  <motion.div
                    key={corner}
                    className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full`}
                    style={{
                      top: corner.includes("t") ? "-6px" : "auto",
                      bottom: corner.includes("b") ? "-6px" : "auto",
                      left: corner.includes("l") ? "-6px" : "auto",
                      right: corner.includes("r") ? "-6px" : "auto",
                      cursor: cornerCursors[i],
                    }}
                    drag
                    dragMomentum={false}
                    onDrag={(e, info) => handleResize(e, info, corner)}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
);

// --- Context Menu ---
const ContextMenu = ({
  x,
  y,
  onDuplicate,
  onDelete,
  onClose,
}: {
  x: string;
  y: string;
  onDuplicate: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onDelete: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onClose: (e: Event) => void;
}) => {
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      // @ts-ignore ---------------------------------------------------------
      // only for contains (error , shows current doesnot exist on type never)
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      style={{ top: y, left: x }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute z-30 bg-white dark:bg-zinc-800 shadow-xl rounded-lg border border-zinc-200 dark:border-zinc-700 w-40 text-sm overflow-hidden"
    >
      <button
        onClick={onDuplicate}
        className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
      >
        <Copy size={14} /> Duplicate
      </button>
      <div className="h-[1px] bg-zinc-200 dark:bg-zinc-700"></div>
      <button
        onClick={onDelete}
        className="w-full text-left px-3 py-2 flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"
      >
        <Trash2 size={14} /> Delete
      </button>
    </motion.div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function PlaygroundPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [canvasComponents, setCanvasComponents] = useState([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [contextMenu, setContextMenu] = useState<{
    x: string;
    y: string;
    instanceId: string;
  } | null>(null);
  const [isAiMode, setIsAiMode] = useState(false);
  const canvasRef = useRef(null);

  const handleDragStart = useCallback(
    (e: any, component: { id: string }) =>
      e.dataTransfer.setData("text/plain", component.id),
    []
  );

  const handleDrop = useCallback((e: any, parentId = null) => {
    e.preventDefault();
    e.stopPropagation();
    const componentId = e.dataTransfer.getData("text/plain");
    const componentDef = components.find((c) => c.id === componentId);
    if (!componentDef) return;

    const newComponent = {
      ...componentDef.defaultProps,
      id: componentDef.id,
      instanceId: Date.now(),
      children: [],
    };

    if (!canvasRef || canvasRef == null) throw Error("canvas ref is empty");

    const canvasRect = (
      canvasRef.current as unknown as HTMLCanvasElement
    ).getBoundingClientRect();

    if (parentId) {
      const addRecursively = (comps) =>
        comps.map((c) =>
          c.instanceId === parentId
            ? { ...c, children: [...c.children, newComponent] }
            : {
                ...c,
                children: c.children ? addRecursively(c.children) : c.children,
              }
        );
      setCanvasComponents((prev) => addRecursively(prev));
    } else {
      newComponent.position = {
        x: e.clientX - canvasRect.left - 100,
        y: e.clientY - canvasRect.top - 50,
      };
      newComponent.size = componentDef.tags.includes("container")
        ? { width: 400, height: 300 }
        : { width: 200, height: 50 };
      setCanvasComponents((prev) => [...prev, newComponent]);
    }
  }, []);

  const updateComponent = useCallback((instanceId, newProps) => {
    const updateRecursively = (comps) =>
      comps.map((c) =>
        c.instanceId === instanceId
          ? { ...c, ...newProps }
          : c.children
          ? { ...c, children: updateRecursively(c.children) }
          : c
      );
    setCanvasComponents(updateRecursively);
  }, []);

  const selectedComponent = useMemo(() => {
    if (!selectedComponentId) return null;
    const findRecursively = (comps) => {
      for (const comp of comps) {
        if (comp.instanceId === selectedComponentId) return comp;
        if (comp.children) {
          const found = findRecursively(comp.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findRecursively(canvasComponents);
  }, [selectedComponentId, canvasComponents]);

  const handleContextMenu = useCallback((e: any, instanceId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedComponentId(instanceId);
    setContextMenu({ x: e.clientX, y: e.clientY, instanceId });
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const deleteComponent = useCallback((instanceId) => {
    const deleteRecursively = (comps) =>
      comps
        .filter((c) => c.instanceId !== instanceId)
        .map((c) =>
          c.children ? { ...c, children: deleteRecursively(c.children) } : c
        );
    setCanvasComponents(deleteRecursively);
    setSelectedComponentId(null);
  }, []);

  const duplicateComponent = useCallback(
    (instanceId) => {
      const findAndDuplicate = (comps) => {
        for (const comp of comps) {
          if (comp.instanceId === instanceId) {
            return {
              ...comp,
              instanceId: Date.now(),
              position: { x: comp.position.x + 20, y: comp.position.y + 20 },
            };
          }
          if (comp.children) {
            const found = findAndDuplicate(comp.children);
            if (found) return found;
          }
        }
        return null;
      };
      const newComp = findAndDuplicate(canvasComponents);
      if (newComp) setCanvasComponents((prev) => [...prev, newComp]);
    },
    [canvasComponents]
  );

  const renderCanvasComponent = useCallback(
    (comp) => {
      const Component = componentMap[comp.id];
      const isContainer = components
        .find((c) => c.id === comp.id)
        .tags.includes("container");

      return (
        <div
          onDrop={(e) => isContainer && handleDrop(e, comp.instanceId)}
          onDragOver={(e) => {
            if (isContainer) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="w-full h-full"
        >
          <Component {...comp}>
            {comp.children &&
              comp.children.map((child) => renderCanvasComponent(child))}
          </Component>
        </div>
      );
    },
    [handleDrop]
  );

  return (
    <ComponentContext.Provider value={componentMap}>
      <div className="bg-zinc-100 dark:bg-zinc-950 min-h-screen font-sans text-zinc-800 dark:text-zinc-200">
        <div className="flex h-screen">
          {/* Left Sidebar */}
          <aside className="w-64 h-full flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col">
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
              {components.map((component) => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-grab"
                >
                  <h3 className="font-semibold text-sm">{component.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {component.description}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          {/* Center: Canvas & AI Chat */}
          <main className="flex-1 flex flex-col overflow-hidden relative">
            <div className="flex-shrink-0 flex justify-center items-center p-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10">
              <div className="flex items-center gap-2 p-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                <button
                  onClick={() => setDeviceMode("desktop")}
                  className={`p-2 rounded-md transition-colors ${
                    deviceMode === "desktop"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-zinc-300/50"
                  }`}
                >
                  <Monitor size={20} />
                </button>
                <button
                  onClick={() => setDeviceMode("tablet")}
                  className={`p-2 rounded-md transition-colors ${
                    deviceMode === "tablet"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-zinc-300/50"
                  }`}
                >
                  <Tablet size={20} />
                </button>
                <button
                  onClick={() => setDeviceMode("mobile")}
                  className={`p-2 rounded-md transition-colors ${
                    deviceMode === "mobile"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-zinc-300/50"
                  }`}
                >
                  <Smartphone size={20} />
                </button>
              </div>
            </div>
            <div className="flex-grow p-8 flex justify-center items-center overflow-auto">
              <motion.div
                ref={canvasRef}
                onDrop={(e) => handleDrop(e, null)}
                onDragOver={(e) => e.preventDefault()}
                onMouseDownCapture={() => {
                  setSelectedComponentId(null);
                  closeContextMenu();
                }}
                onContextMenu={(e) => handleContextMenu(e, null)}
                className="bg-white dark:bg-zinc-900 shadow-2xl relative overflow-hidden"
                animate={{
                  width:
                    deviceMode === "desktop"
                      ? 1280
                      : deviceMode === "tablet"
                      ? 768
                      : 375,
                  height: 720,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {canvasComponents.map((comp) => (
                  <ResizableFrame
                    key={comp.instanceId}
                    comp={comp}
                    onSelect={setSelectedComponentId}
                    onUpdate={updateComponent}
                    isSelected={selectedComponentId === comp.instanceId}
                    onContextMenu={handleContextMenu}
                  >
                    {renderCanvasComponent(comp)}
                  </ResizableFrame>
                ))}
              </motion.div>
            </div>
          </main>

          {/* Inspector Panel */}
          <AnimatePresence>
            {selectedComponent && (
              <motion.aside
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-14 right-4 w-72 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 z-20"
              >
                <h2 className="text-base font-bold mb-2 p-2 border-b border-zinc-200 dark:border-zinc-700">
                  {selectedComponent.id}
                </h2>
                <div className="flex flex-col gap-4">
                  {Object.keys(selectedComponent).map((propName) => {
                    const propValue = selectedComponent[propName];
                    if (["label", "text", "src"].includes(propName)) {
                      return (
                        <div key={propName}>
                          <label className="text-xs font-medium uppercase">
                            {propName}
                          </label>
                          <input
                            type="text"
                            value={propValue}
                            onChange={(e) =>
                              updateComponent(selectedComponentId, {
                                [propName]: e.target.value,
                              })
                            }
                            className="w-full mt-1 p-1 rounded-md border border-zinc-300 dark:border-zinc-600 bg-transparent"
                          />
                        </div>
                      );
                    }
                    if (propName === "size") {
                      return (
                        <div key={propName}>
                          <label className="text-xs font-medium uppercase">
                            Size
                          </label>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="number"
                              placeholder="W"
                              value={parseInt(propValue.width)}
                              onChange={(e) =>
                                updateComponent(selectedComponentId, {
                                  size: {
                                    ...propValue,
                                    width: parseInt(e.target.value) || "auto",
                                  },
                                })
                              }
                              className="w-1/2 p-1 rounded-md border border-zinc-300 dark:border-zinc-600 bg-transparent"
                            />
                            <input
                              type="number"
                              placeholder="H"
                              value={parseInt(propValue.height)}
                              onChange={(e) =>
                                updateComponent(selectedComponentId, {
                                  size: {
                                    ...propValue,
                                    height: parseInt(e.target.value) || "auto",
                                  },
                                })
                              }
                              className="w-1/2 p-1 rounded-md border border-zinc-300 dark:border-zinc-600 bg-transparent"
                            />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Context Menu */}
          <AnimatePresence>
            {contextMenu && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={closeContextMenu}
                onDelete={() => {
                  if (contextMenu?.instanceId)
                    deleteComponent(contextMenu.instanceId);
                  closeContextMenu();
                }}
                onDuplicate={() => {
                  if (contextMenu.instanceId)
                    duplicateComponent(contextMenu.instanceId);
                  closeContextMenu();
                }}
              />
            )}
          </AnimatePresence>

          <div className="absolute bottom-10 left-[30%]  z-30 ">
            <input
              type="text"
              title="Box to enter the prompt"
              placeholder="For eg: Make a beautiful dashboard "
              size={80}
              className="rounded-xl bg-white ring ring-zinc-200 w-full text-xl font-comic-sans py-3 px-4 focus:outline-none
              placeholder:text-zinc-500    transition-all focus:shadow-md hover:shadow-md focus:placeholder:text-zinc-300"
            />
          </div>

          <AnimatePresence>
            {isAiMode && (
              <motion.div className="absolute inset-0 z-20 overflow-hidden">
                <motion.div className="z-99 flex items-center justify-center"></motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ComponentContext.Provider>
  );
}
