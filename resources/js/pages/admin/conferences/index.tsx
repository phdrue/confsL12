import CreateConferenceForm from '@/components/forms/conferences/create';
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
    states: Array<ConferenceState>;
    types: Array<ConferenceType>;
    conferences: Array<Conference>;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="max-w-screen-2xl space-y-10 p-4 pb-16 md:p-6">
                <div className="space-y-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold">Конференции</h1>
                    </div>
                    <CreateConferenceForm types={types} />
                    <ConferencesAdminDataTable conferences={conferences} states={states} types={types} />
                </div>
            </div>
        </AppLayout>
    );
}
