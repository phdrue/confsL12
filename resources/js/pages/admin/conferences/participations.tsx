import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Degree, Title } from '@/types/other';
import { Head } from '@inertiajs/react';
import AttendanceAdminDataTable from '@/components/tables/attendance-admin-data-table';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';

export default function Participations({
    conference,
    users,
    degrees,
    titles,
}: {
    conference: Conference,
    users: Array<User>,
    degrees: Array<Degree>,
    titles: Array<Title>,
}) {
    const { toast } = useToast();
    const [isDownloadingBook, setIsDownloadingBook] = useState(false);
    const [isDownloadingReports, setIsDownloadingReports] = useState(false);
    const [isDownloadingAttendance, setIsDownloadingAttendance] = useState(false);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="space-y-4 max-w-screen-2xl pb-16 p-4 md:p-6">
                <div className="flex gap-2 items-center flex-wrap">
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
                </div>
                <AttendanceAdminDataTable 
                    conference={conference}
                    participants={users} 
                    degrees={degrees}
                    titles={titles}
                />
            </div>
        </AppLayout>
    );
}
