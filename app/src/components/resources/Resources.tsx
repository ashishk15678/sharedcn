import { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { ReactNode } from 'react';

// Lazy load sub-components
const ComponentCard = lazy(() => import('@/components/ui/ComponentCard'));
const ComponentModal = lazy(() => import('@/components/ui/ComponentModal'));

export interface ComponentData {
    id: string;
    title: string;
    description: string;
    tags: string[];
    component: ReactNode;
    code: string;
}

// Lazy load UI components
const components: ComponentData[] = [
    {
        id: "1",
        title: "Gradient Button",
        description: "A beautiful gradient button with hover effects",
        tags: ["Buttons", "Animation"],
        // @ts-ignore
        component: lazy(() => import('@/components/GradientButton')),
        code: `const GradientButton = () => (...)`
    },
    // ... other components
];

export function Resources() {
    const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
    const [selectedTag, setSelectedTag] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");

    const handleComponentSelect = useCallback((component: ComponentData) => {
        setSelectedComponent(component);
    }, []);

    const filteredComponents = useMemo(() => {
        return components.filter(component => {
            const matchesSearch = searchQuery === "" ||
                component.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                component.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTag = selectedTag === "All" || component.tags.includes(selectedTag);
            return matchesSearch && matchesTag;
        });
    }, [searchQuery, selectedTag]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
                {/* ... sidebar content ... */}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {/* ... search bar ... */}

                {/* Components Grid with chunked loading */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredComponents.map((component) => (
                        <Suspense
                            key={component.id}
                            fallback={
                                <div className="h-44 bg-gray-100 rounded-xl animate-pulse" />
                            }
                        >
                            <ComponentCard
                                component={component}
                                onSelect={handleComponentSelect}
                            />
                        </Suspense>
                    ))}
                </div>
            </div>

            {/* Modal with Suspense */}
            {selectedComponent && (
                <Suspense fallback={null}>
                    <ComponentModal
                        component={selectedComponent}
                        onClose={() => setSelectedComponent(null)}
                    />
                </Suspense>
            )}
        </div>
    );
} 