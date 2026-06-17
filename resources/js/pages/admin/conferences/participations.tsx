import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Degree, Title } from '@/types/other';
import { Head, router } from '@inertiajs/react';
import AttendanceAdminDataTable from '@/components/tables/attendance-admin-data-table';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';
import { parseDateString } from '@/parse-date-string';

interface PaginatedData<T> {
    data: Array<T>;
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    per_page?: number;
}

export default function Participations({
    conference,
    users,
    degrees,
    titles,
}: {
    conference: Conference,
    users: PaginatedData<User>,
    degrees: Array<Degree>,
    titles: Array<Title>,
}) {
    const { toast } = useToast();
    const [isDownloadingBook, setIsDownloadingBook] = useState(false);
    const [isDownloadingReports, setIsDownloadingReports] = useState(false);
    const [isDownloadingAttendance, setIsDownloadingAttendance] = useState(false);
    const [isDownloadingParticipantsExcel, setIsDownloadingParticipantsExcel] = useState(false);
    const [isDownloadingCertificates, setIsDownloadingCertificates] = useState(false);
    const [openCertificatesDialog, setOpenCertificatesDialog] = useState(false);
    const [certificatesConferenceName, setCertificatesConferenceName] = useState('');
    const [certificatesDateText, setCertificatesDateText] = useState('');

    const formatRuLongDate = (date: Date): string => {
        if (Number.isNaN(date.getTime())) {
            return '';
        }

        const parts = new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).formatToParts(date);

        const day = parts.find((part) => part.type === 'day')?.value ?? '';
        const month = parts.find((part) => part.type === 'month')?.value ?? '';
        const year = parts.find((part) => part.type === 'year')?.value ?? '';

        const core = [day, month, year].filter(Boolean).join(' ').trim();
        if (!core) {
            return '';
        }

        return `${core} года`;
    };

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

    const handleDownloadBook = async () => {
        setIsDownloadingBook(true);
        try {
            const response = await fetch(route('adm.conferences.get-book', conference.id));
            
            if (response.ok) {
                // Check if response is a file download
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/')) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `thesises-${conference.id}.docx`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    setOpenCertificatesDialog(false);
                } else {
                    // Handle JSON error response
                    const errorData = await response.json();
                    toast({
                        variant: "destructive",
                        title: "Ошибка",
                        description: errorData.error || "Произошла ошибка при загрузке файла"
                    });
                }
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Ошибка",
                    description: errorData.error || "Произошла ошибка при загрузке файла"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Произошла ошибка при загрузке файла"
            });
        } finally {
            setIsDownloadingBook(false);
        }
    };

    const handleDownloadReports = async () => {
        setIsDownloadingReports(true);
        try {
            const response = await fetch(route('adm.conferences.get-reports-book', conference.id));
            
            if (response.ok) {
                // Check if response is a file download
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/')) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `reports-${conference.id}.docx`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } else {
                    // Handle JSON error response
                    const errorData = await response.json();
                    toast({
                        variant: "destructive",
                        title: "Ошибка",
                        description: errorData.error || "Произошла ошибка при загрузке файла"
                    });
                }
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Ошибка",
                    description: errorData.error || "Произошла ошибка при загрузке файла"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Произошла ошибка при загрузке файла"
            });
        } finally {
            setIsDownloadingReports(false);
        }
    };

    const handleDownloadAttendance = async () => {
        setIsDownloadingAttendance(true);
        try {
            const response = await fetch(route('adm.conferences.get-attendance-list', conference.id));
            
            if (response.ok) {
                // Check if response is a file download
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/')) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `attendance-${conference.id}.docx`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } else {
                    // Handle JSON error response
                    const errorData = await response.json();
                    toast({
                        variant: "destructive",
                        title: "Ошибка",
                        description: errorData.error || "Произошла ошибка при загрузке файла"
                    });
                }
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Ошибка",
                    description: errorData.error || "Произошла ошибка при загрузке файла"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Произошла ошибка при загрузке файла"
            });
        } finally {
            setIsDownloadingAttendance(false);
        }
    };

    const handleDownloadParticipantsExcel = async () => {
        setIsDownloadingParticipantsExcel(true);
        try {
            const response = await fetch(route('adm.conferences.get-participants-excel', conference.id));

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/')) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `participants-${conference.id}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } else {
                    const errorData = await response.json();
                    toast({
                        variant: "destructive",
                        title: "Ошибка",
                        description: errorData.error || "Произошла ошибка при загрузке файла"
                    });
                }
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Ошибка",
                    description: errorData.error || "Произошла ошибка при загрузке файла"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Произошла ошибка при загрузке файла"
            });
        } finally {
            setIsDownloadingParticipantsExcel(false);
        }
    };

    const handleDownloadCertificates = async () => {
        setIsDownloadingCertificates(true);
        try {
            const downloadUrl = new URL(route('adm.conferences.get-certificates-book', conference.id), window.location.origin);

            if (certificatesConferenceName.trim()) {
                downloadUrl.searchParams.set('conference_name', certificatesConferenceName.trim());
            }

            if (certificatesDateText.trim()) {
                downloadUrl.searchParams.set('data', certificatesDateText.trim());
            }

            const response = await fetch(downloadUrl.toString());

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/')) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `certificates-${conference.id}.docx`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } else {
                    const errorData = await response.json();
                    toast({
                        variant: "destructive",
                        title: "Ошибка",
                        description: errorData.error || "Произошла ошибка при загрузке файла"
                    });
                }
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Ошибка",
                    description: errorData.error || "Произошла ошибка при загрузке файла"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Произошла ошибка при загрузке файла"
            });
        } finally {
            setIsDownloadingCertificates(false);
        }
    };

    const handleOpenCertificatesDialog = () => {
        const parsedConferenceDate = parseDateString(conference.date);

        setCertificatesConferenceName(conference.name ?? '');
        setCertificatesDateText(formatRuLongDate(parsedConferenceDate));
        setOpenCertificatesDialog(true);
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="max-w-screen-2xl space-y-10 p-4 pb-16 md:p-6">
                <div className="grid grid-cols-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
                    <div className="space-y-4 md:col-span-2 lg:col-span-3">
                        <div className="flex flex-wrap items-center gap-2">
                    <div className="sm:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Действия
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={handleDownloadBook} disabled={isDownloadingBook}>
                                    {isDownloadingBook ? 'Загрузка...' : 'Сборник тезисов'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDownloadReports} disabled={isDownloadingReports}>
                                    {isDownloadingReports ? 'Загрузка...' : 'Сборник докладов'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDownloadAttendance} disabled={isDownloadingAttendance}>
                                    {isDownloadingAttendance ? 'Загрузка...' : 'Список присутствующих'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDownloadParticipantsExcel} disabled={isDownloadingParticipantsExcel}>
                                    {isDownloadingParticipantsExcel ? 'Загрузка...' : 'Участники (Excel)'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleOpenCertificatesDialog}>
                                    Сертификаты
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href="/background.jpg" download>
                                        Подложка
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="hidden sm:flex gap-2 items-center flex-wrap">
                        <Button
                            onClick={handleDownloadBook}
                            disabled={isDownloadingBook}
                        >
                            {isDownloadingBook ? 'Загрузка...' : 'Сборник тезисов'}
                        </Button>
                        <Button
                            onClick={handleDownloadReports}
                            disabled={isDownloadingReports}
                        >
                            {isDownloadingReports ? 'Загрузка...' : 'Сборник докладов'}
                        </Button>
                        <Button
                            onClick={handleDownloadAttendance}
                            disabled={isDownloadingAttendance}
                        >
                            {isDownloadingAttendance ? 'Загрузка...' : 'Список присутствующих'}
                        </Button>
                        <Button
                            onClick={handleDownloadParticipantsExcel}
                            disabled={isDownloadingParticipantsExcel}
                        >
                            {isDownloadingParticipantsExcel ? 'Загрузка...' : 'Участники (Excel)'}
                        </Button>
                        <Button
                            onClick={handleOpenCertificatesDialog}
                        >
                            Сертификаты
                        </Button>
                        <Button asChild variant="outline">
                            <a href="/background.jpg" download>
                                Подложка
                            </a>
                        </Button>
                    </div>
                        </div>
                        <Dialog open={openCertificatesDialog} onOpenChange={setOpenCertificatesDialog}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Параметры генерации сертификатов</DialogTitle>
                                    <DialogDescription>
                                        По умолчанию подставлены текущие название конференции и дата.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="certificates-conference-name">Название конференции</Label>
                                        <Input
                                            id="certificates-conference-name"
                                            value={certificatesConferenceName}
                                            onChange={(event) => setCertificatesConferenceName(event.target.value)}
                                            placeholder="Введите название конференции"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="certificates-date-text">Дата (текст)</Label>
                                        <Input
                                            id="certificates-date-text"
                                            value={certificatesDateText}
                                            onChange={(event) => setCertificatesDateText(event.target.value)}
                                            placeholder="Например: 13 января 2026 года"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setOpenCertificatesDialog(false)}
                                        disabled={isDownloadingCertificates}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        onClick={handleDownloadCertificates}
                                        disabled={isDownloadingCertificates}
                                    >
                                        {isDownloadingCertificates ? 'Загрузка...' : 'Сгенерировать'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <AttendanceAdminDataTable
                            conference={conference}
                            participants={users.data}
                            degrees={degrees}
                            titles={titles}
                            rowNumberOffset={Math.max((users.from ?? 1) - 1, 0)}
                        />
                        {users.last_page > 1 && (
                            <div className="flex justify-center pt-4">
                                <Pagination
                                    currentPage={users.current_page}
                                    totalPages={users.last_page}
                                    onPageChange={handlePageChange}
                                    totalItems={users.total}
                                    itemsPerPage={users.per_page}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
