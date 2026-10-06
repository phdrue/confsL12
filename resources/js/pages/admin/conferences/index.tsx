import CreateConferenceForm from '@/components/forms/conferences/create';
import ConferencesAdminDataTable from '@/components/tables/conferences-admin-data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { useToast } from '@/hooks/use-toast';
import { type BreadcrumbItem } from '@/types';
import { Conference, ConferenceState, ConferenceType } from '@/types/conferences';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Администрирование',
        href: '/dashboard',
    },
];

export default function Index({
    states,
    types,
    conferences,
}: {
    states: Array<ConferenceState>;
    types: Array<ConferenceType>;
    conferences: Array<Conference>;
}) {
    const { toast } = useToast();
    const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

    const handleDownload = async (format: 'docx' | 'pdf') => {
        const setLoading = format === 'docx' ? setIsDownloadingDocx : setIsDownloadingPdf;
        const routeName = format === 'docx'
            ? 'adm.conferences.export-planned-docx'
            : 'adm.conferences.export-planned-pdf';
        const filename = format === 'docx' ? 'planned-conferences.docx' : 'planned-conferences.pdf';

        setLoading(true);

        try {
            const response = await fetch(route(routeName));

            if (!response.ok) {
                toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Произошла ошибка при экспорте плана мероприятий',
                });

                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Произошла ошибка при экспорте плана мероприятий',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="space-y-10 max-w-screen-2xl pb-16 p-4 md:p-6">
                <div className="grid grid-cols-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
                    <div className="min-w-0 space-y-6 md:col-span-2 lg:col-span-3">
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-3xl font-semibold">Конференции</h1>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button variant="outline" asChild>
                                    <a href="/manual1.pdf" download>
                                        Пособие
                                    </a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href="/manual2.pdf" download>
                                        Инструкция
                                    </a>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isDownloadingDocx || isDownloadingPdf}
                                    onClick={() => handleDownload('docx')}
                                >
                                    {isDownloadingDocx ? 'Экспорт DOCX...' : 'Экспорт плана (DOCX)'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isDownloadingDocx || isDownloadingPdf}
                                    onClick={() => handleDownload('pdf')}
                                >
                                    {isDownloadingPdf ? 'Экспорт PDF...' : 'Экспорт плана (PDF)'}
                                </Button>
                            </div>
                        </div>
                        {/* <CreateConferenceForm types={types} /> */}
                        <ConferencesAdminDataTable conferences={conferences} states={states} types={types} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
