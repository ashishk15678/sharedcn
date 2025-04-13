import { motion } from "framer-motion";
import { Code } from "lucide-react";
import { memo, useCallback, useMemo, useState, useRef, useEffect } from "react";



// Loading fallback component
export const ResourcesLoadingFallback = () => (
    <div className="h-screen w-screen bg-gradient-to-b from-white to-green-200 flex items-center justify-center">
        <div className="space-y-4 text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600">Loading components library...</p>
        </div>
    </div>
);

const BottomGradient = () => {
    return (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white to-transparent h-24 z-10" />
    );
};

const BackgroundBeams = () => {
    return (

        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-[10px] opacity-50">
                {/* Gradient beams */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-green-200 to-green-300 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-r from-blue-100 to-blue-200 rounded-full blur-3xl" />
                <div className="absolute top-3/4 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] bg-gradient-to-r from-purple-100 to-purple-200 rounded-full blur-3xl" />
            </div>
            <BottomGradient />
        </div>
    );
};

// Add this custom hook for the tilt effect
function useTilt() {
    const ref = useRef<HTMLDivElement>(null);
    // @ts-ignore
    const frameRef = useRef<number>();
    // @ts-ignore
    const lastMouseEvent = useRef<MouseEvent>();

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            lastMouseEvent.current = e;
            if (!frameRef.current) {
                frameRef.current = requestAnimationFrame(updateTilt);
            }
        };

        const updateTilt = () => {
            // @ts-ignore
            frameRef.current = undefined;
            if (!lastMouseEvent.current || !element) return;

            const e = lastMouseEvent.current;
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = (y - centerY) / 20;
            const tiltY = (centerX - x) / 20;

            element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        };

        const handleMouseLeave = () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                // @ts-ignore
                frameRef.current = undefined;
            }
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return ref;
}


// Add this interface above the Resources component
interface ComponentData {
    id: string;
    title: string;
    description: string;
    tags: string[];
    component: React.ReactNode;
    code: string;
}

// Example components to showcase
const GradientButton = () => (
    <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity">
        Gradient Button
    </button>
);

const ModeToggler = () => {
    const [isDark, setIsDark] = useState(false);
    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-full transition-colors ${isDark ? "bg-slate-800" : "bg-yellow-400"
                }`}
        >
            {isDark ? "🌙" : "☀️"}
        </button>
    );
};

export function Resources() {
    const [selectedTag, setSelectedTag] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);

    const tags = [
        "All",
        "Buttons",
        "Forms",
        "Navigation",
        "Cards",
        "Layout",
        "Animation",
        "Data Display",
        "Feedback",
        "Input",
        "Typography"
    ];

    const components: ComponentData[] = [
        {
            id: "1",
            title: "Gradient Button",
            description: "A beautiful gradient button with hover effects",
            tags: ["Buttons", "Animation"],
            component: <GradientButton />,
            code: `const GradientButton = () => (
    <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity">
      Gradient Button
    </button>
  );`
        },
        {
            id: "2",
            title: "Mode Toggler",
            description: "A beautiful mode toggler with hover effects",
            tags: ["Buttons", "Animation"],
            component: <ModeToggler />,
            code: `const ModeToggler = () => {
    const [isDark, setIsDark] = useState(false);
    return (
      <button
        onClick={() => setIsDark(!isDark)}
        className={\`p-2 rounded-full transition-colors \${
          isDark ? "bg-slate-800" : "bg-yellow-400"
        }\`}
      >
        {isDark ? "🌙" : "☀️"}
      </button>
    );
  };`
        },
        // Add more components here
    ];

    // 5. Memoize the filtered components
    const filteredComponents = useMemo(() => {
        return components.filter(component => {
            const matchesSearch = searchQuery === "" ||
                component.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                component.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTag = !selectedTag || selectedTag === "All" || component.tags.includes(selectedTag);
            return matchesSearch && matchesTag;
        });
    }, [searchQuery, selectedTag]);

    // 6. Memoize handlers
    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleTagSelect = useCallback((tag: string) => {
        setSelectedTag(tag);
    }, []);

    const handleComponentSelect = useCallback((component: ComponentData) => {
        setSelectedComponent(component);
    }, []);

    // 7. Memoize the tags list
    const tagButtons = useMemo(() => (
        <nav className="space-y-1">
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tag === selectedTag
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    {tag}
                </button>
            ))}
        </nav>
    ), [selectedTag, handleTagSelect]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Components</h2>
                    <p className="text-sm text-gray-500 mt-1">Browse by category</p>
                </div>
                {tagButtons}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {selectedTag === "All" ? "All Components" : selectedTag}
                        </h1>
                        <div className="relative w-96">
                            <input
                                type="text"
                                placeholder="Search components..."
                                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Components Grid with virtualization for large lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredComponents.map((component) => (
                        <ComponentCard
                            key={component.id}
                            component={component}
                            onSelect={handleComponentSelect}
                        />
                    ))}
                </div>
            </div>

            {/* Modal - only mounted when needed */}
            {selectedComponent && (
                <ComponentModal
                    component={selectedComponent}
                    onClose={() => setSelectedComponent(null)}
                />
            )}
        </div>
    );
}

// 8. Separate Modal component
const ComponentModal = memo(({ component, onClose }: {
    component: ComponentData;
    onClose: () => void;
}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{component.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="mb-4">
                    <p className="text-gray-600">{component.description}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto">
                        <code>{component.code}</code>
                    </pre>
                </div>
                <div className="flex gap-2">
                    {component.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
});

ComponentModal.displayName = 'ComponentModal';

// 9. Add proper types for better TypeScript optimization
interface ComponentData {
    id: string;
    title: string;
    description: string;
    tags: string[];
    component: React.ReactNode;
    code: string;
}

// 3. Create a separate ComponentCard component for better rendering optimization
const ComponentCard = memo(({ component, onSelect }: {
    component: ComponentData;
    onSelect: (component: ComponentData) => void;
}) => {
    const tiltRef = useTilt();

    return (
        <motion.div
            key={component.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            ref={tiltRef}
            // @ts-ignore
            className="group bg-white rounded-xl overflow-hidden border border-gray-200 relative transition-all duration-300"
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease' }}
        >
            {/* Preview Section */}
            <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center overflow-hidden">
                {/* Subtle grid background */}
                <div className="absolute inset-0 opacity-[0.02] bg-grid-pattern" />

                {/* Component wrapper */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                        {component.component}
                    </div>
                </div>

                {/* Animated code button */}
                <motion.button
                    initial={{ y: -20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    // @ts-ignore
                    className="absolute top-0 right-4 px-3 py-1.5 rounded-b-lg bg-gray-900 text-white font-medium flex items-center gap-2 text-sm transform-gpu"
                    onClick={() => onSelect(component)}
                >
                    <Code className="w-4 h-4" />
                    View Code
                </motion.button>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        {component.title}
                        <span className="flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                        </span>
                    </h3>
                    <div className="flex gap-1">
                        {component.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100/50 whitespace-nowrap"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                    {component.description}
                </p>
            </div>

            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-green-500/10 to-transparent transform rotate-45 translate-x-6 -translate-y-6" />
            </div>
        </motion.div>
    );
});

ComponentCard.displayName = 'ComponentCard';

