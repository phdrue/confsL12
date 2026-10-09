import ConferencesAdminDataTable from '@/components/tables/conferences-admin-data-table';
import { Button } from '@/components/ui/button';
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
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:col-span-2 lg:col-span-3">
                        <p className="font-semibold leading-none tracking-tight">
                            Конференции, где я ответственный
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button variant="outline" asChild>
                                <a href="/manual1.pdf" download>
                                    Пособие
                                </a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="/manual2.pdf" download>
                                    Инструкция
                                </a>
                            </Button>
                        </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        <ConferencesAdminDataTable conferences={conferences} states={states} types={types} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
