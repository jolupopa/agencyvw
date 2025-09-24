import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    guard: 'web' | 'admin';
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
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown; // <-- Firma de índice para manejar props dinámicas

}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Listing {
    id?: number;
    title: string;
    description: string | null;
    price: number | null;
    currency: string;
    offer_type_id: number | string;
    property_type_id: number | string;
    city: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    land_area: number | null;
    built_area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    floors: number | null;
    parking_spaces: number | null;
    amenities:  Amenity[];
    parent_id: number | null;
    user_id?: number;
    offer_type?: Option;
    property_type?: Option;
    media?: Media[];
}

export interface Option {
    id: number;
    name: string;
    category?: string;
}

export interface Amenity {
    id: number;
    name: string;
    slug: string;
    icon?: string;
}

export interface Subproject {
    title: string;
    description: string | null;
    price: number | null;
    property_type_id: number | string;
    land_area: number | null;
    built_area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    floors: number | null;
    parking_spaces: number | null;
    amenities:  Amenity[];
    user_id?: number;
}

export interface Media {
    id: number;
    path: string;
    type: 'image' | 'video' | 'plan' | '360_tour';
    order: number;
}
