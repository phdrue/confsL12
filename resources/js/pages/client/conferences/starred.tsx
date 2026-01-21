import StarredConferencesDataTable from '@/components/tables/starred-conferences-data-table';
import AppLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference, ConferenceType } from '@/types/conferences';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Личный кабинет',
        href: '/dashboard',
    },
    {
        title: 'Избранные конференции',
        href: route('client.conferences.starred'),
    },
];

export default function StarredConferences({ 
    conferences,
    types,
}: { 
    conferences: Array<Conference>;
    types: Array<ConferenceType>;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Избранные конференции" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-semibold">Избранные конференции</h1>
                    <p className="text-muted-foreground mt-1">
                        Конференции, которые вы отметили как избранные
                    </p>
                </div>
                {conferences.length > 0 ? (
                    <StarredConferencesDataTable conferences={conferences} types={types} />
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                        <div className="text-center">
                            <p className="text-muted-foreground text-lg">Нет избранных конференций</p>
                            <p className="text-muted-foreground mt-2 text-sm">
                                Отметьте конференции звездочкой, чтобы добавить их в избранное
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
