import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head, router } from '@inertiajs/react';
import { ConferenceCard } from '@/components/conferences/card';
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
        title: 'Мероприятия',
        href: route('conferences.index'),
    },
];

interface State {
    id: number;
    name: string;
}

interface PaginatedData {
    data: Array<Conference>;
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index({
    conferences,
    currentState,
    currentName,
    currentType,
    currentStateName,
    states
}: {
    conferences: PaginatedData;
    currentState: string | null;
    currentName: string | null;
    currentType: string | null;
    currentStateName: string;
    states: Array<State>;
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
        url.searchParams.delete('page'); // Reset to first page when filtering
        router.get(url.pathname + url.search, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleTypeFilter = (type_id: number | null) => {
        const url = new URL(window.location.href);
        if (type_id === null) {
            url.searchParams.delete('type');
        } else {
            url.searchParams.set('type', type_id.toString());
        }
        url.searchParams.delete('page'); // Reset to first page when filtering
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
            <Head title="Мероприятия" />
            <ConferenceLayout heading={currentStateName}>
                <div className="w-full flex flex-col items-center gap-12 px-4 sm:px-6 lg:px-16">
                    {/* filters */}
                    <div className="flex flex-col gap-4 w-full">
                        {/* Name Filter */}
                        <div className="w-full max-w-md">
                            <Input
                                type="text"
                                placeholder="Поиск по названию мероприятия..."
                                value={nameFilter}
                                onChange={(e) => handleNameFilter(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        
                        {/* Type Filters */}
                        <div className="flex flex-row flex-wrap gap-4 w-full">
                            <Button onClick={() => handleTypeFilter(null)} variant={`${currentType === null ? "brandDarkBlue" : "ghost"}`}>Все</Button>
                            <Button onClick={() => handleTypeFilter(1)} variant={`${currentType === "1" ? "brandDarkBlue" : "ghost"}`}>Региональные</Button>
                            <Button onClick={() => handleTypeFilter(2)} variant={`${currentType === "2" ? "brandDarkBlue" : "ghost"}`}>Всероссийские</Button>
                            <Button onClick={() => handleTypeFilter(3)} variant={`${currentType === "3" ? "brandDarkBlue" : "ghost"}`}>Международные</Button>
                            <Button onClick={() => handleTypeFilter(4)} variant={`${currentType === "4" ? "brandDarkBlue" : "ghost"}`}>Другие</Button>
                        </div>
                    </div>
                    {conferences.data && conferences.data.length > 0 ? (
                        conferences.data.map((conference) => (
                            <ConferenceCard key={conference.id} conference={conference} />
                        ))
                    ) : (
                        <div className="w-full text-center py-12">
                            <p className="text-gray-500 text-lg">Мероприятия не найдены</p>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {conferences.last_page > 1 && (
                        <div className="w-full flex justify-center mt-8">
                            <Pagination
                                currentPage={conferences.current_page}
                                totalPages={conferences.last_page}
                                onPageChange={handlePageChange}
                                // showInfo={true}
                                totalItems={conferences.total}
                                itemsPerPage={1}
                            />
                        </div>
                    )}
                </div>
            </ConferenceLayout>
            <Footer />
        </ClientLayout >
    );
}
