import React, { useState, useMemo, useCallback, Suspense, useEffect } from 'react';
import { ComponentData } from './Resources';
import ComponentCard from '../ui/ComponentCard';
import ComponentModal from '../ui/ComponentModal';
import { components } from '@/components';
import { useRouter, useSearchParams } from 'next/navigation';

export function ResourcesComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedTag, setSelectedTag] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);

    // Handle URL query parameter for component selection
    useEffect(() => {
        const componentName = searchParams.get('component');
        if (componentName) {
            const component = components.find(c =>
                c.title.toLowerCase().replace(/\s+/g, '-') === componentName.toLowerCase()
            );
            if (component) {
                // @ts-ignore
                setSelectedComponent(component);
            }
        }
    }, [searchParams]);

    const handleComponentSelect = useCallback((component: ComponentData) => {
        // Create URL-friendly component name
        const urlFriendlyName = component.title.toLowerCase().replace(/\s+/g, '-');

        // Update URL with component name
        router.push(`?component=${urlFriendlyName}`, { scroll: false });
        setSelectedComponent(component);
    }, [router]);

    const handleCloseModal = useCallback(() => {
        // Remove component parameter from URL when modal is closed
        router.push('', { scroll: false });
        setSelectedComponent(null);
    }, [router]);

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
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Components</h2>
                    <p className="text-sm text-gray-500 mt-1">Browse by category</p>
                </div>
                <nav className="space-y-1 flex flex-col justify-start items-start">
                    {["All", "Buttons", "Forms", "Navigation", "Cards", "Layout", "Animation", "Data Display", "Feedback", "Input", "Typography", "Other"].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tag === selectedTag
                                ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                } `}
                        >
                            {tag}
                        </button>
                    ))}
                </nav>
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
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                // @ts-ignore
                                component={component}
                                onSelect={handleComponentSelect}
                            />
                        </Suspense>
                    ))}
                </div>
            </div>

            {/* Updated Modal with new onClose handler */}
            {selectedComponent && (
                <Suspense fallback={null}>
                    <ComponentModal
                        component={selectedComponent}
                        onClose={handleCloseModal}
                    />
                </Suspense>
            )}
        </div>
    );
} 