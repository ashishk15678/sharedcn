import React from 'react';

export const BackgroundBeams: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-[10px] opacity-50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-green-200 to-green-300 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-r from-blue-100 to-blue-200 rounded-full blur-3xl" />
                <div className="absolute top-3/4 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] bg-gradient-to-r from-purple-100 to-purple-200 rounded-full blur-3xl" />
            </div>
        </div>
    );
}; 