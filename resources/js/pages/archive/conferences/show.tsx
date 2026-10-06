import ConferenceLayout from '@/components/conferences/layout';
import Footer from '@/components/landing/footer';
import { Badge } from '@/components/ui/badge';
import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { LegacyConference, LegacyConferenceFile } from '@/types/legacy';
import { Head } from '@inertiajs/react';

function formatDate(value: string | null): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('ru-RU');
}

function formatSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} Б`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} КБ`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function kindLabel(file: LegacyConferenceFile): string {
    if (file.kind === 'image') {
        return 'изображение';
    }
    if (file.kind === 'video') {
        return 'видео';
    }
    if (file.kind === 'document') {
        return file.mime || 'документ';
    }

    return file.mime || 'файл';
}

export default function Show({ conference }: { conference: LegacyConference }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Архив сайта',
            href: route('archive.conferences.index'),
        },
        {
            title: conference.title,
            href: route('archive.conferences.show', conference.slug),
        },
    ];

    const files = conference.files ?? [];

    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title={conference.title} />
            <ConferenceLayout heading={conference.title} showHeader={false}>
                <div className="flex w-full flex-col items-center gap-6">
                    <div className="w-full px-4 sm:px-6 lg:px-16">
                        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-50">{conference.title}</h1>
                        {conference.published_at && (
                            <p className="text-brand-textSecondary mt-3 text-sm font-semibold uppercase">{formatDate(conference.published_at)}</p>
                        )}
                        <div
                            className="legacy-archive-content mt-8"
                            dangerouslySetInnerHTML={{ __html: conference.content_html }}
                        />
                        {files.length > 0 && (
                            <div className="mt-10 space-y-3">
                                <h3 className="text-xl font-semibold">Материалы</h3>
                                <ul className="flex flex-col gap-2">
                                    {files.map((file) => (
                                        <li key={file.id} className="flex flex-wrap items-center gap-3 rounded-lg border bg-white p-3 dark:bg-slate-900">
                                            <a
                                                href={route('archive.files.download', file.id)}
                                                className="text-brand-red font-medium underline underline-offset-2"
                                            >
                                                {file.original_name}
                                            </a>
                                            <Badge variant="secondary">{kindLabel(file)}</Badge>
                                            <span className="text-sm text-slate-500">{formatSize(file.size)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </ConferenceLayout>
            <Footer />
        </ClientLayout>
    );
}
