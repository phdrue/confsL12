import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Conference } from '@/types/conferences';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import ShowConference from '@/components/conferences/show';
import { ConferenceBlock as ConferenceBlockType } from '@/types/blocks';
import InputError from '@/components/input-error';
import { useToast } from "@/hooks/use-toast"
import { ConferenceCard } from '@/components/conferences/card';
import ConferenceLayout from '@/components/conferences/layout';
import ReportParticipationForm from '@/components/forms/participations/report';
import { Country } from '@/types/other';

export default function Show({
    conference,
    blocks,
    countries
}: {
    conference: Conference,
    blocks: Array<ConferenceBlockType>,
    countris: Array<Country>
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
                <div className="w-full flex flex-col items-center gap-12 px-16">
                    <ShowConference conference={conference} blocks={blocks} />


                    {!auth.user ?
                        <div className='gap-6 flex flex-col'>
                            Войдите, чтобы участвовать
                            {Boolean(conference.allow_report) &&
                                <p>Можно подать доклад</p>
                            }
                            {Boolean(conference.allow_thesis) &&
                                <p>Можно подать тезисы</p>
                            }
                        </div> :
                        <div className="gap-6 flex">
                            <form className="flex flex-col gap-6" onSubmit={submit}>
                                {/* <InputError message={errors.?authorization ?? ""} /> */}
                                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Участвовать
                                </Button>
                            </form>
                            {Boolean(conference.allow_report) &&
                                <ReportParticipationForm countries={countries} />
                            }
                            {Boolean(conference.allow_thesis) &&
                                <form className="flex flex-col gap-6" onSubmit={submit}>
                                    {/* <InputError message={errors.?authorization ?? ""} /> */}
                                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Подать тезисы
                                    </Button>
                                </form>
                            }
                        </div>
                    }


                </div>
            </ConferenceLayout>
        </ClientLayout >
    );
}
