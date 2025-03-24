import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ParticipationsAdminDataTable from '@/components/tables/participations-admin-data-table';
import ParticipationsChart from "@/components/charts/conferences/participations";
import ResponsibleForm from "@/components/forms/conferences/responsible";
import ResponsibleAdminDataTable from "@/components/tables/responsible-admin-data-table";

export default function Responsible({
    conference,
    responsible,
    availableToBeResponsible,
}: {
    conference: Conference,
    responsible: Array<User>,
    availableToBeResponsible: Array<User>,
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Конференции',
            href: route('adm.conferences.index'),
        },
        {
            title: 'Ответственные',
            href: route('adm.conferences.responsible', conference.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="space-y-10 max-w-screen-2xl pb-16 p-4 md:p-6">
                <div className="grid grid-cols-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
                    <div className="md:col-span-2 lg:col-span-3">
                        <ResponsibleForm conference={conference} users={availableToBeResponsible} />
                        <ResponsibleAdminDataTable conference={conference} users={responsible} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
