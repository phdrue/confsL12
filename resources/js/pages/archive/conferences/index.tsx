import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { LegacyConference } from '@/types/legacy';
import { Head, router } from '@inertiajs/react';
import { LegacyConferenceCard } from '@/components/archive/conference-card';
import ConferenceLayout from '@/components/conferences/layout';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Стартовая страница',
        href: route('home'),
    },
    {
        title: 'Архив сайта',
        href: route('archive.conferences.index'),
    },
];

interface PaginatedData {
    data: Array<LegacyConference>;
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index({
    conferences,
    currentName,
    currentYear,
    years,
}: {
    conferences: PaginatedData;
    currentName: string | null;
    currentYear: number | null;
    years: Array<number>;
}) {
    const [nameFilter, setNameFilter] = useState(currentName || '');

    const handleNameFilter = (value: string) => {
        setNameFilter(value);
        const url = new URL(window.location.href);
        if (value.trim()) {
            url.searchParams.set('name', value.trim());
        } else {
            url.searchParams.delete('name');
        }
        url.searchParams.delete('page');
        router.get(url.pathname + url.search, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleYearFilter = (year: number | null) => {
        const url = new URL(window.location.href);
        if (year === null) {
            url.searchParams.delete('year');
        } else {
            url.searchParams.set('year', year.toString());
        }
        url.searchParams.delete('page');
        router.get(url.pathname + url.search, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page.toString());
        router.get(url.pathname + url.search, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title="Архив сайта" />
            <ConferenceLayout heading="архив сайта">
                <div className="flex w-full flex-col items-center gap-12 px-4 sm:px-6 lg:px-16">
                    <div className="flex w-full flex-col gap-4">
                        <div className="w-full max-w-md">
                            <Input
                                type="text"
                                placeholder="Поиск по названию мероприятия..."
                                value={nameFilter}
                                onChange={(e) => handleNameFilter(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="flex w-full flex-row flex-wrap gap-4">
                            <Button onClick={() => handleYearFilter(null)} variant={`${currentYear === null ? 'brandDarkBlue' : 'ghost'}`}>
                                Все годы
                            </Button>
                            {years.map((year) => (
                                <Button
                                    key={year}
                                    onClick={() => handleYearFilter(year)}
                                    variant={`${currentYear === year ? 'brandDarkBlue' : 'ghost'}`}
                                >
                                    {year}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {conferences.data && conferences.data.length > 0 ? (
                        conferences.data.map((conference) => (
                            <LegacyConferenceCard key={conference.id} conference={conference} />
                        ))
                    ) : (
                        <div className="w-full py-12 text-center">
                            <p className="text-lg text-gray-500">Мероприятия не найдены</p>
                        </div>
                    )}
                    {conferences.last_page > 1 && (
                        <div className="mt-8 flex w-full justify-center">
                            <Pagination
                                currentPage={conferences.current_page}
                                totalPages={conferences.last_page}
                                onPageChange={handlePageChange}
                                totalItems={conferences.total}
                                itemsPerPage={12}
                            />
                        </div>
                    )}
                </div>
            </ConferenceLayout>
            <Footer />
        </ClientLayout>
    );
}
