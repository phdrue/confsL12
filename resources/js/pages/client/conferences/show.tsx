import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Conference, ReportType } from '@/types/conferences';
import { Head, Link, usePage } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import ShowConference from '@/components/conferences/show';
import { ConferenceBlock as ConferenceBlockType } from '@/types/blocks';
import ConferenceLayout from '@/components/conferences/layout';
import ReportParticipationForm from "@/components/forms/participations/report";
import { Country } from '@/types/other';
import ThesisParticipationForm from "@/components/forms/participations/thesis";
import Footer from '@/components/landing/footer';
import RegularParticipationForm from "@/components/forms/participations/regular";
import ParticipationForm from "@/components/forms/participations/form";

export default function Show({
    conference,
    blocks,
    countries,
    reportTypes
}: {
    conference: Conference,
    blocks: Array<ConferenceBlockType>,
    countries: Array<Country>,
    reportTypes: Array<ReportType>
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
            <ConferenceLayout>
                <div className="w-full flex flex-col items-center gap-12">
                    <div className="px-4 sm:px-6 lg:px-16">
                        <ShowConference conference={conference} blocks={blocks} />
                    </div>

                    <div className="relative flex flex-col py-12 items-center w-full lg:px-16">
                        {!auth.user &&
                            <div className="absolute inset-0 flex items-center gap-3 font-semibold backdrop-blur-lg justify-center">
                                <Lock size={20} /><span className=""><span className="underline underline-offset-2"><Link href={route('login')}>Войдите</Link></span>, чтобы участвовать</span>
                            </div>
                        }
                        <div className="lg:gap-6 justify-center items-center gap-3 flex md:flex-row flex-wrap w-full">
                            <ParticipationForm countries={countries} reportTypes={reportTypes} conference={conference} />
                        </div>
                    </div>

                </div>
            </ConferenceLayout>
            <Footer />
        </ClientLayout >
    );
}
