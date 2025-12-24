import Footer from '@/components/landing/footer';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

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

export default function TablePage({ conferences }: { conferences: PaginatedData }) {
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

    // Table columns for proposal data
    const proposalColumns: ColumnDef<Conference>[] = [
        {
            accessorKey: 'proposal.payload.name',
            header: 'Название',
            cell: ({ row }) => {
                const proposal = row.original.proposal;
                return proposal?.payload?.name || '—';
            },
        },
        {
            accessorKey: 'proposal.payload.date',
            header: 'Дата начала',
            cell: ({ row }) => {
                const proposal = row.original.proposal;
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
            header: 'Организация',
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
        },
        {
            accessorKey: 'proposal.payload.topics',
            header: 'Тематика',
            cell: ({ row }) => {
                const proposal = row.original.proposal;
                return proposal?.payload?.topics || '—';
            },
        },
        {
            accessorKey: 'proposal.payload.department',
            header: 'Кафедра',
            cell: ({ row }) => {
                const proposal = row.original.proposal;
                return proposal?.payload?.department || '—';
            },
        },
    ];

    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title="Мероприятия - Таблица" />
            <div className="mx-auto mb-24 w-full max-w-screen-xl pt-16">
                <div className="mx-auto max-w-2xl px-4 sm:px-6">
                    <h2 className="text-center text-3xl font-semibold sm:text-4xl">План мероприятий</h2>
                </div>
                <div className="flex w-full flex-col items-center gap-12 px-4 sm:px-6 lg:px-16">
                    {conferences.data && conferences.data.length > 0 ? (
                        <>
                            <div className="w-full">
                                <DataTable columns={proposalColumns} data={conferences.data} />
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
