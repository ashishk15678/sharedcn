import { ReactNode } from 'react';

export interface ComponentData {
    id: string;
    title: string;
    description: string;
    tags: string[];
    component: ReactNode;
    code: string;
} 