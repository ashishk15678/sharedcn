import React from 'react';
import { ComponentData } from '@/components/resources/Resources';
import { Code } from 'lucide-react';

interface ComponentCardProps {
    component: ComponentData;
    onSelect: (component: ComponentData) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component, onSelect }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Preview Section */}
            <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                        {component.component}
                    </div>
                </div>
                <button
                    className="absolute top-2 right-2 px-3 py-2 rounded-lg bg-transparent backdrop-blur-sm ring-1 ring-zinc-300 shadow-xl text-zinc-800 font-medium flex items-center gap-2 text-sm hover:bg-zinc-100 transition-colors"
                    onClick={() => onSelect(component)}
                >
                    <Code className="w-4 h-4" />
                    View Code
                </button>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <h3 className="text-lg font-semibold">{component.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{component.description}</p>
                <div className="flex gap-2 mt-3">
                    {component.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ComponentCard; 