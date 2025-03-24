import { LucideIcon } from 'lucide-react';
import * as ConferenceTypes from '@/types/conferences'

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface Role {
    id: number,
    name: string
}

export interface User {
    id: number;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;

    // profile
    first_name: string;
    last_name: string;
    second_name: string;
    organization: string;
    position: string;
    city: string;
    country_id: number;
    degree_id: number;
    title_id: number;
    phone: string;

    //roles
    roles?: Array<Role>

    [key: string]: unknown; // This allows for additional properties...
}
