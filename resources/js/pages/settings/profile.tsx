import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/user-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Country, Degree, Title } from '@/types/other';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Настройки профиля',
        href: '/settings/profile',
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
    countries,
    degrees,
    titles
}: {
    mustVerifyEmail: boolean;
    status?: string,
    countries: Array<Country>,
    degrees: Array<Degree>,
    titles: Array<Title>
}) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful, setError } = useForm({
        first_name: auth.user.first_name ?? '',
        last_name: auth.user.last_name ?? '',
        second_name: auth.user.second_name ?? '',
        organization: auth.user.organization ?? '',
        position: auth.user.position ?? '',
        city: auth.user.city ?? '',
        country_id: auth.user.country_id ? String(auth.user.country_id) : '',
        degree_id: auth.user.degree_id ? String(auth.user.degree_id) : '',
        title_id: auth.user.title_id ? String(auth.user.title_id) : '',
        phone: auth.user.phone ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.country_id === '') {
            setError('country_id', 'Пожалуйста, выберите страну');
            return;
        }

        if (data.degree_id === '') {
            setError('degree_id', 'Пожалуйста, выберите ученую степень');
            return;
        }

        if (data.title_id === '') {
            setError('title_id', 'Пожалуйста, выберите ученое звание');
            return;
        }

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Настройки профиля" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Мой профиль" description="Пожалуйста, заполните следующие поля" />

                    <form onSubmit={submit} className="space-y-6">

                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Фамилия</Label>

                            <Input
                                id="last_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                required
                                placeholder="Фамилия"
                            />

                            <InputError className="mt-2" message={errors.last_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">Имя</Label>

                            <Input
                                id="first_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                required
                                placeholder="Имя"
                            />

                            <InputError className="mt-2" message={errors.first_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="second_name">Отчество</Label>

                            <Input
                                id="second_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.second_name}
                                onChange={(e) => setData('second_name', e.target.value)}
                                required
                                placeholder="Отчество"
                            />

                            <InputError className="mt-2" message={errors.second_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="organization">Организация</Label>

                            <Input
                                id="organization"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.organization}
                                onChange={(e) => setData('organization', e.target.value)}
                                required
                                placeholder="Организация"
                            />

                            <InputError className="mt-2" message={errors.organization} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="position">Должность</Label>

                            <Input
                                id="position"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.position}
                                onChange={(e) => setData('position', e.target.value)}
                                required
                                placeholder="Должность"
                            />

                            <InputError className="mt-2" message={errors.position} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="city">Город</Label>

                            <Input
                                id="city"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                required
                                placeholder="Город"
                            />

                            <InputError className="mt-2" message={errors.city} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Телефон</Label>

                            <Input
                                id="phone"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                                placeholder="Телефон"
                            />

                            <InputError className="mt-2" message={errors.phone} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country_id">Страна</Label>
                            <Select required name="country_id" value={data.country_id} onValueChange={(country_id) => setData('country_id', country_id)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите страну" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem key={country.id} value={String(country.id)}>{country.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.country_id} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="degree_id">Ученая степень</Label>
                            <Select required name="degree_id" value={data.degree_id} onValueChange={(degree_id) => setData('degree_id', degree_id)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите степень" />
                                </SelectTrigger>
                                <SelectContent>
                                    {degrees.map((degree) => (
                                        <SelectItem key={degree.id} value={String(degree.id)}>{degree.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.degree_id} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title_id">Ученое звание</Label>
                            <Select required name="title_id" value={data.title_id} onValueChange={(title_id) => setData('title_id', title_id)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите звание" />
                                </SelectTrigger>
                                <SelectContent>
                                    {titles.map((title) => (
                                        <SelectItem key={title.id} value={String(title.id)}>{title.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.title_id} className="mt-2" />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="mt-2 text-sm text-neutral-800">
                                    Your email address is unverified.
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="rounded-md text-sm text-neutral-600 underline hover:text-neutral-900 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                                    >
                                        Click here to re-send the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Сохранить</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Сохранено</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
