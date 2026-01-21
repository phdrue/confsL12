import ConferenceLayout from '@/components/conferences/layout';
import ShowConference from '@/components/conferences/show';
import ParticipationForm from '@/components/forms/participations/form';
import Footer from '@/components/landing/footer';
import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { ConferenceBlock as ConferenceBlockType } from '@/types/blocks';
import { Conference, ReportType } from '@/types/conferences';
import { Country } from '@/types/other';
import { Head, Link, usePage } from '@inertiajs/react';
import { Lock } from 'lucide-react';

export default function Show({
    conference,
    blocks,
    countries,
    reportTypes,
    participation,
    existingDocuments,
}: {
    conference: Conference;
    blocks: Array<ConferenceBlockType>;
    countries: Array<Country>;
    reportTypes: Array<ReportType>;
    participation?: { id: number; confirmed: boolean } | null;
    existingDocuments?: { reports: Array<any>; thesises: Array<any> };
}) {
    const { auth } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Мероприятия',
            href: route('conferences.index'),
        },
        {
            title: 'Конференция',
            href: route('conferences.show', conference.id),
        },
    ];

    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title={conference.name} />
            <ConferenceLayout heading={conference.name} showHeader={false}>
                <div className="flex w-full flex-col items-center gap-12">
                    <div className="px-4 sm:px-6 lg:px-16 w-full">
                        <ShowConference conference={conference} blocks={blocks} />
                    </div>

                    {conference.state_id == 3 && (
                        <div className="relative flex w-full flex-col items-center px-4 py-12 sm:px-6 lg:px-16">
                            {!auth.user && (
                                <div className="absolute inset-0 flex items-center justify-center gap-3 font-semibold backdrop-blur-lg">
                                    <Lock size={20} />
                                    <span className="">
                                        <span className="underline underline-offset-2">
                                            <Link href={route('login')}>Войдите</Link>
                                        </span>
                                        , чтобы участвовать
                                    </span>
                                </div>
                            )}
                            <div className="flex w-full flex-wrap items-center justify-center gap-3 md:flex-row lg:gap-6">
                                <ParticipationForm
                                    countries={countries}
                                    reportTypes={reportTypes}
                                    conference={conference}
                                    participation={participation}
                                    existingDocuments={existingDocuments}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </ConferenceLayout>
            <Footer />
        </ClientLayout>
    );
}
