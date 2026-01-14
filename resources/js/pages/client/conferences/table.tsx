import Footer from '@/components/landing/footer';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

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

interface PaginatedData {
    data: Array<Conference>;
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

export default function TablePage({ 
    conferences,
    currentSortBy,
    currentSortOrder,
    currentSearch,
}: { 
    conferences: PaginatedData;
    currentSortBy?: string | null;
    currentSortOrder?: string | null;
    currentSearch?: string | null;
}) {
    const [searchValue, setSearchValue] = useState(currentSearch || '');
    const [sortBy, setSortBy] = useState(currentSortBy || '');
    const [sortOrder, setSortOrder] = useState(currentSortOrder || 'asc');

    // Update local state when props change
    useEffect(() => {
        setSearchValue(currentSearch || '');
        setSortBy(currentSortBy || '');
        setSortOrder(currentSortOrder || 'asc');
    }, [currentSearch, currentSortBy, currentSortOrder]);

    const updateFilters = () => {
        const url = new URL(window.location.href);
        
        // Reset to first page when filters change
        url.searchParams.delete('page');
        
        if (searchValue.trim()) {
            url.searchParams.set('search', searchValue.trim());
        } else {
            url.searchParams.delete('search');
        }
        
        if (sortBy) {
            url.searchParams.set('sort_by', sortBy);
            url.searchParams.set('sort_order', sortOrder);
        } else {
            url.searchParams.delete('sort_by');
            url.searchParams.delete('sort_order');
        }
        
        router.get(
            url.pathname + url.search,
            {},
            {
                preserveState: false,
                preserveScroll: false,
            },
        );
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters();
    };

    const handleSortByChange = (value: string) => {
        setSortBy(value);
        if (value) {
            // If changing sort field, keep current order or default to asc
            const newOrder = sortBy === value ? sortOrder : 'asc';
            setSortOrder(newOrder);
            const url = new URL(window.location.href);
            url.searchParams.delete('page');
            url.searchParams.set('sort_by', value);
            url.searchParams.set('sort_order', newOrder);
            if (searchValue.trim()) {
                url.searchParams.set('search', searchValue.trim());
            }
            router.get(
                url.pathname + url.search,
                {},
                {
                    preserveState: false,
                    preserveScroll: false,
                },
            );
        }
    };

    const handleSortOrderChange = (value: string) => {
        setSortOrder(value);
        if (sortBy) {
            const url = new URL(window.location.href);
            url.searchParams.delete('page');
            url.searchParams.set('sort_by', sortBy);
            url.searchParams.set('sort_order', value);
            if (searchValue.trim()) {
                url.searchParams.set('search', searchValue.trim());
            }
            router.get(
                url.pathname + url.search,
                {},
                {
                    preserveState: false,
                    preserveScroll: false,
                },
            );
        }
    };

    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page.toString());
        router.get(
            url.pathname + url.search,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearFilters = () => {
        setSearchValue('');
        setSortBy('');
        setSortOrder('asc');
        router.get(
            route('conferences.table'),
            {},
            {
                preserveState: false,
                preserveScroll: false,
            },
        );
    };

    const handleRowClick = (conference: Conference) => {
        router.visit(route('conferences.show', conference.id));
    };

    // Table columns for proposal data
    const proposalColumns: ColumnDef<Conference>[] = [
        {
            accessorKey: 'proposal.payload.name',
            header: 'Название',
            cell: ({ row }) => {
                const proposal = row.original.proposal;
                const conference = row.original;
                // If no proposal, show conference name
                if (!proposal) {
                    return conference.name || '—';
                }
                return proposal?.payload?.name || '—';
            },
        },
        {
            accessorKey: 'proposal.payload.date',
            header: 'Дата начала',
            cell: ({ row }) => {
                const proposal = row.original.proposal;
                const conference = row.original;
                // If no proposal, show conference date
                if (!proposal) {
                    if (!conference.date) return '—';
                    return new Date(conference.date).toLocaleDateString('ru-RU');
                }
                if (!proposal?.payload?.date) return '—';
                return new Date(proposal.payload.date).toLocaleDateString('ru-RU');
            },
        },
        {
            accessorKey: 'proposal.payload.endDate',
            header: 'Дата окончания',
            cell: ({ row }) => {
                const proposal = row.original.proposal;
                if (!proposal?.payload?.endDate) return '—';
                return new Date(proposal.payload.endDate).toLocaleDateString('ru-RU');
            },
        },
        {
            accessorKey: 'proposal.payload.organization',
            header: 'Организатор',
            cell: ({ row }) => {
                const proposal = row.original.proposal;
                if (!proposal?.payload) return '—';
                const org = proposal.payload.organization || '';
                const orgOther = proposal.payload.organizationOther || '';
                const combined = [org, orgOther].filter(Boolean).join(' ');
                return combined || '—';
            },
        },
        {
            accessorKey: 'proposal.payload.form',
            header: 'Форма проведения',
            cell: ({ row }) => {
                const proposal = row.original.proposal;
                return proposal?.payload?.form || '—';
            },
        },
        {
            accessorKey: 'proposal.payload.bookType',
            header: 'Тип сборника',
            cell: ({ row }) => {
                const proposal = row.original.proposal;
                return proposal?.payload?.bookType || '—';
            },
        }
    ];

    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title="Мероприятия - Таблица" />
            <div className="mx-auto mb-24 w-full max-w-screen-xl pt-16">
                <div className="mx-auto mb-12 max-w-2xl px-4 sm:px-6">
                    <h2 className="text-center text-3xl font-semibold sm:text-4xl">План мероприятий</h2>
                </div>
                <div className="flex w-full flex-col items-center gap-12 px-4 sm:px-6 lg:px-16">
                    {/* Filters and Sorting Controls */}
                    <div className="w-full flex flex-col gap-4">
                        {/* Search Field */}
                        <form onSubmit={handleSearchSubmit} className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Поиск по названию, организации, тематике, кафедре..."
                                value={searchValue}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit">Поиск</Button>
                            {(searchValue || sortBy) && (
                                <Button type="button" variant="outline" onClick={clearFilters}>
                                    Очистить
                                </Button>
                            )}
                        </form>
                        
                        {/* Sorting Controls */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Сортировка по:</label>
                                <Select value={sortBy} onValueChange={handleSortByChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Выберите поле" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">Дата</SelectItem>
                                        <SelectItem value="form">Форма проведения</SelectItem>
                                        <SelectItem value="bookType">Тип сборника</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {sortBy && (
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">Порядок:</label>
                                    <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="asc">По возрастанию</SelectItem>
                                            <SelectItem value="desc">По убыванию</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {conferences.data && conferences.data.length > 0 ? (
                        <>
                            <div className="w-full">
                                <DataTable 
                                    columns={proposalColumns} 
                                    data={conferences.data} 
                                    onRowClick={handleRowClick}
                                />
                            </div>
                            {/* Pagination */}
                            {conferences.last_page > 1 && (
                                <div className="mt-8 flex w-full justify-center">
                                    <Pagination
                                        currentPage={conferences.current_page}
                                        totalPages={conferences.last_page}
                                        onPageChange={handlePageChange}
                                        totalItems={conferences.total}
                                        itemsPerPage={15}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full py-12 text-center">
                            <p className="text-lg text-gray-500">Мероприятия не найдены</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </ClientLayout>
    );
}
