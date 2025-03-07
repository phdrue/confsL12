import ConferencesClientDataTable from '@/components/tables/conferences-client-data-table';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Личный кабинет',
        href: '/dashboard',
    },
];

export default function Dashboard({ conferences }: { conferences: Array<Conference> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Личный кабинет" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ConferencesClientDataTable conferences={conferences} />
            </div>
        </AppLayout>
    );
}
