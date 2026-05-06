import ConferencesClientDataTable from '@/components/tables/conferences-client-data-table';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Администрирование',
        href: '/dashboard',
    },
];

export default function Dashboard({ conferences }: { conferences: Array<Conference> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="space-y-10 max-w-screen-2xl pb-16 p-4 md:p-6">
                <div className="grid grid-cols-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
                    <div className="space-y-4 md:col-span-2 lg:col-span-3">
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-square overflow-hidden rounded-xl border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </div>
                        <ConferencesClientDataTable conferences={conferences} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
