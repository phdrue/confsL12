export type LegacyConferenceFile = {
    id: number;
    original_name: string;
    mime: string | null;
    size: number;
    path: string;
    kind: 'image' | 'document' | 'other' | string;
    is_featured: boolean;
};

export type LegacyConferenceCategory = {
    id: number;
    name: string;
    slug: string;
};

export type LegacyConference = {
    id: number;
    wp_id: number;
    slug: string;
    title: string;
    content_html: string;
    excerpt: string | null;
    status: string;
    published_at: string | null;
    source_url: string | null;
    featured_file?: LegacyConferenceFile | null;
    files?: LegacyConferenceFile[];
    categories?: LegacyConferenceCategory[];
};
