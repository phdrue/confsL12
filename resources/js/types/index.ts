import { LucideIcon } from 'lucide-react';
import * as ConferenceTypes from '@/types/conferences'

export interface Auth {
    user: User;
    roles: string[];
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
    first_name: string | null;
    last_name: string | null;
    second_name: string | null;
    organization: string | null;
    position: string | null;
    city: string | null;
    country_id: number | null;
    degree_id: number | null;
    title_id: number | null;
    phone: string | null;

    //roles
    roles?: Array<Role>

    [key: string]: unknown; // This allows for additional properties...
}
