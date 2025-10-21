import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head } from '@inertiajs/react';
import { ConferenceCard } from '@/components/conferences/card';
import ConferenceLayout from '@/components/conferences/layout';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
    const [_conferences, _setConferences] = useState(conferences);
    const [type, setType] = useState<number | null>(null);

    const filterByType = (type_id: number | null): void => {
        if (type_id === null) {
            setType(null);
            _setConferences(conferences);
        } else {
            setType(type_id);
            const filtered = conferences.filter((conference) => conference.type_id === type_id);
            _setConferences(filtered);
        }
    };

    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title="Мероприятия" />
            <ConferenceLayout>
                <div className="w-full flex flex-col items-center gap-12 px-4 sm:px-6 lg:px-16">
                    {/* filters */}
                    <div className="flex flex-row flex-wrap gap-4 w-full">
                        <Button onClick={() => filterByType(null)} variant={`${type === null ? "brandDarkBlue" : "ghost"}`}>Все</Button>
                        <Button onClick={() => filterByType(1)} variant={`${type === 1 ? "brandDarkBlue" : "ghost"}`}>Международные</Button>
                        <Button onClick={() => filterByType(2)} variant={`${type === 2 ? "brandDarkBlue" : "ghost"}`}>Всероссийские</Button>
                        <Button onClick={() => filterByType(3)} variant={`${type === 3 ? "brandDarkBlue" : "ghost"}`}>Региональные</Button>
                        <Button onClick={() => filterByType(4)} variant={`${type === 4 ? "brandDarkBlue" : "ghost"}`}>Другие</Button>
                    </div>
                    {_conferences && _conferences.map((conference) => (
                        <ConferenceCard key={conference.id} conference={conference} />
                    ))}
                </div>
            </ConferenceLayout>
            <Footer />
        </ClientLayout >
    );
}
