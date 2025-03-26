import ConferencesAdminDataTable from '@/components/tables/conferences-admin-data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference, ConferenceState, ConferenceType } from '@/types/conferences';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Администрирование',
        href: '/dashboard',
    },
];

export default function Index({
    states,
    types,
    conferences,
}: {
    states: Array<ConferenceState>,
    types: Array<ConferenceType>,
    conferences: Array<Conference>
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="space-y-10 max-w-screen-2xl pb-16 p-4 md:p-6">
                <div className="grid grid-cols-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
                    <p className="font-semibold leading-none tracking-tight">
                        Конференции, где я ответственный
                    </p>
                    <div className="md:col-span-2 lg:col-span-3">
                        <ConferencesAdminDataTable conferences={conferences} states={states} types={types} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
