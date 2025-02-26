import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Conference } from '@/types/conferences';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Личный кабинет',
        href: '/dashboard',
    },
];

export default function Show({
    conference
}: {
    conference: Conference
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('client.conferences.participate', 1), {
            onFinish: () => console.log('finish'),
            onSuccess: () => console.log('success'),
            onError: () => console.log('error'),
        });
    };

    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title="Личный кабинет" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-square overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    {conference.description}

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Log in
                        </Button>
                    </form>
                </div>
            </div >
        </ClientLayout >
    );
}
