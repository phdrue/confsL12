import { Conference, ConferenceState, ConferenceType } from "@/types/conferences"
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from "@/types";
import { Head } from '@inertiajs/react';
import EditConferenceForm from "@/components/forms/conferences/edit";
import ToggleFrontPageForm from "@/components/forms/conferences/toggle-front-page";
import ChangeConferenceStateForm from "@/components/forms/conferences/change-state";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Администрирование',
        href: '/dashboard',
    },
];

export default function Edit({
    states,
    types,
    conference,
}: {
    states: Array<ConferenceState>,
    types: Array<ConferenceType>,
    conference: Conference,
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="space-y-10 max-w-screen-2xl pb-16 p-4 md:p-6">
                <div className="grid grid-cols-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
                    <EditConferenceForm conference={conference} types={types} />
                    <div className="flex flex-col gap-10">
                        <ToggleFrontPageForm conference={conference} />
                        <ChangeConferenceStateForm conference={conference} states={states} />
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
