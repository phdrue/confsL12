import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ParticipationsAdminDataTable from '@/components/tables/participations-admin-data-table';
import ParticipationsChart from "@/components/charts/conferences/participations";
import { Button } from "@/components/ui/button";

export default function Participations({
    conference,
    users
}: {
    conference: Conference,
    users: Array<User>,
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
            <div className="space-y-4 max-w-screen-2xl pb-16 p-4 md:p-6">
                <div className="flex gap-2 items-center flex-wrap">
                    <Button onClick={() => window.open(route('adm.conferences.get-book', conference.id))}>
                        Сборник тезисов
                    </Button>
                    <Button onClick={() => window.open(route('adm.conferences.get-reports-book', conference.id))}>
                        Сборник докладов
                    </Button>
                </div>
                <ParticipationsAdminDataTable conference={conference} participants={users} />
            </div>
        </AppLayout>
    );
}
