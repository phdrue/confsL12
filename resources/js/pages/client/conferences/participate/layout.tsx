import Footer from '@/components/landing/footer';
import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head } from '@inertiajs/react';

export default function ParticipationWizardLayout({
    conference,
    title,
    children,
}: {
    conference: Conference;
    title: string;
    children: React.ReactNode;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Мероприятия',
            href: route('conferences.index'),
        },
        {
            title: conference.name,
            href: route('conferences.show', conference.id),
        },
        {
            title,
            href: route('client.conferences.participation', conference.id),
        },
    ];

    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title={`${title} — ${conference.name}`} />
            <div className="mx-auto mb-24 w-full max-w-xl px-4 pt-16 sm:px-6">
                {children}
            </div>
            <Footer />
        </ClientLayout>
    );
}
