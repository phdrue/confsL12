import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Conference, ReportType } from '@/types/conferences';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Lock } from 'lucide-react';
import ShowConference from '@/components/conferences/show';
import { ConferenceBlock as ConferenceBlockType } from '@/types/blocks';
import InputError from '@/components/input-error';
import { useToast } from "@/hooks/use-toast"
import { ConferenceCard } from '@/components/conferences/card';
import ConferenceLayout from '@/components/conferences/layout';
import ReportParticipationForm from '@/components/forms/participations/report';
import { Country } from '@/types/other';
import ThesisParticipationForm from "@/components/forms/participations/thesis";
import Footer from '@/components/landing/footer';

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
    const { toast } = useToast()

    const { post, processing } = useForm({
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('client.conferences.participate', conference.id), {
            onError: (err) => {
                toast({
                    variant: 'destructive',
                    title: 'Вы уже участвуете в конференции',
                })
            },
        });
    };

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
                            <form className="" onSubmit={submit}>
                                {/* <InputError message={errors.?authorization ?? ""} /> */}
                                <Button type="submit" variant={"brandDarkBlue"} className="" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Участвовать
                                </Button>
                            </form>
                            {Boolean(conference.allow_report) &&
                                <ReportParticipationForm reportTypes={reportTypes} countries={countries} />
                            }
                            {Boolean(conference.allow_thesis) &&
                                <ThesisParticipationForm countries={countries} />
                            }
                        </div>

                    </div>

                </div>
            </ConferenceLayout>
            <Footer />
        </ClientLayout >
    );
}
