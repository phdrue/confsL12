import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ConferencesActivitiesChart from '@/components/charts/conferences/activities';
import ConferencesTypesChart from '@/components/charts/conferences/types';
import ConferencesUsersChart from '@/components/charts/conferences/users';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Администрирование',
        href: '/dashboard',
    },
];

export default function Statistics() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Статистика" />
            <div className="space-y-10 max-w-screen-2xl pb-16 p-4 md:p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold">Статистика</h1>
                    <p className="text-muted-foreground mt-2">Аналитика по конференциям</p>
                </div>
                <div className="grid grid-cols-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
                    <ConferencesTypesChart />
                    <ConferencesUsersChart />
                    <ConferencesActivitiesChart />
                </div>
            </div>
        </AppLayout>
    );
}
