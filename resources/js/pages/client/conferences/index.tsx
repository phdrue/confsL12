import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ConferenceCard } from '@/components/conferences/card';
import ConferenceLayout from '@/components/conferences/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Стартовая страница',
        href: route('home'),
    },
    {
        title: 'Мероприятия',
        href: route('conferences.index'),
    },
];

export default function Index({
    conferences
}: {
    conferences: Array<Conference>
}) {

    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title="Мероприятия" />
            <ConferenceLayout>
                <div className="w-full flex flex-col items-center gap-12 px-16">
                    {/* filters */}
                    {/* <div className="flex flex-row flex-wrap gap-4 w-full">
                            <Button variant="outline">Все</Button>
                            <Button variant="brandCyan">Международная</Button>
                            <Button variant="outline">Всероссийская</Button>
                            <Button variant="outline">Региональная</Button>
                        </div> */}
                    {conferences && conferences.map((conference) => (
                        <ConferenceCard key={conference.id} conference={conference} />
                    ))}
                </div>
            </ConferenceLayout>
        </ClientLayout >
    );
}
