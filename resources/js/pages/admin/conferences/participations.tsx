import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ParticipationsAdminDataTable from '@/components/tables/participations-admin-data-table';

export default function Participations({
    conference,
    regular,
    report,
    thesis
}: {
    conference: Conference,
    regular: Array<User>,
    report: Array<User>,
    thesis: Array<User>,
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Конференции',
            href: route('adm.conferences.index'),
        },
        {
            title: 'Участники',
            href: route('adm.conferences.participations', conference.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="space-y-10 max-w-screen-2xl pb-16 p-4 md:p-6">
                <Tabs defaultValue="regular" className="w-full">
                    <TabsList>
                        <TabsTrigger value="regular">Обычные</TabsTrigger>
                        <TabsTrigger value="report">Доклады</TabsTrigger>
                        <TabsTrigger value="thesis">Тезисы</TabsTrigger>
                    </TabsList>
                    <TabsContent value="regular">
                        <ParticipationsAdminDataTable participants={regular} />
                    </TabsContent>
                    <TabsContent value="report">report</TabsContent>
                    <TabsContent value="thesis">thesis</TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
