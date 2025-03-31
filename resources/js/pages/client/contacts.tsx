import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { PaperclipIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Стартовая страница',
        href: route('home'),
    },
    {
        title: 'Контакты',
        href: route('contacts'),
    },
];

export default function Contacts({ }) {
    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title="Мероприятия" />
            <div className="mx-auto max-w-screen-xl pt-16 mb-24 w-full">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-16">
                    <h1 className="text-center text-3xl sm:text-4xl font-semibold">Контакты</h1>
                </div>
                <div className="flex flex-col lg:flex-row gap-16 px-4 sm:px-6">
                    <div className="flex flex-col order-1 lg:order-2 lg:max-w-md">
                        <div className="">
                            <figure className="flex flex-col gap-10">
                                <figcaption className="flex gap-6">
                                    <img src="img/landing/testimonials/3.png" alt="Вячеслав Александрович Липатов" className="size-24 aspect-square rounded-full object-cover object-top" />
                                </figcaption>
                                <div className="">
                                    <p className="text-base font-semibold">Вячеслав Александрович Липатов</p>
                                    <p>Руководитель проекта</p>
                                </div>
                            </figure>
                            <div className="mt-6 border-t">
                                <dl className="divide-y">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            Адрес
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            305041, Россия, г. Курск, ул. Карла Маркса, д. 3, Курский государственный медицинский университет
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            Cлужебный телефон
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            +7 4712 58-81-39 (приемная проректора по научной работе и инновационному развитию)
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            E-mail
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-brand-red sm:col-span-2 sm:mt-0">
                                            <a href="mailto:kurskgmunauka@mail.ru">kurskgmunauka@mail.ru</a>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="order-2 lg:order-1 flex flex-1">
                        <div>
                            <div className="px-4 sm:px-0">
                                <h3 className="text-base/7 font-semibold">Реквизиты</h3>
                                <p className="mt-1 max-w-2xl text-sm/6 text-muted-foreground">
                                    Наименование юридического лица: Общество с ограниченной ответственностью “МедТестИнфо” (ООО “МедТестИнфо”)
                                </p>
                            </div>
                            <div className="mt-6 border-t">
                                <dl className="divide-y">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            Адрес
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            305041, Россия, г. Курск, ул. Карла Маркса, д. 3, Курский государственный медицинский университет
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            E-mail
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-brand-red sm:col-span-2 sm:mt-0">
                                            <a href="mailto:main@medtestinfo.ru">main@medtestinfo.ru</a>
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            Генеральный директор
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            Вячеслав Александрович Липатов, действующий на основании Устава.
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            ИНН
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            4632160493
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            КПП
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            463201001
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            ОКПО
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            30864956
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            ОГРН
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            1124632000052 от 10.01. 2012 г.
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            Расчетный счет
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            № 40702810001600000433 в ПАО «Курскпромбанк», г. Курск  305000, ул. Ленина ,13
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            БИК
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            043807708
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium">
                                            Кор./счет
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                            30101810800000000708 в отделении Курск
                                        </dd>
                                    </div>

                                    <div className="px-4 py-6 sm:px-0 mt-1 text-sm/6 sm:mt-0">
                                        <a target="_blank" href="" className="text-brand-darkBlue underline underline-offset-2">
                                            Скачать бланк квитанции для перевода денежных средств на расчетный счет ООО “МедТестИнфо”
                                        </a>
                                    </div>
                                    <div className="px-4 py-6 sm:px-0 mt-1 text-sm/6 sm:mt-0">
                                        <a target="_blank" href="" className="text-brand-darkBlue underline underline-offset-2">
                                            Электронная система платежей на русском языке
                                        </a>
                                    </div>
                                    <div className="px-4 py-6 sm:px-0 mt-1 text-sm/6 sm:mt-0">
                                        <a target="_blank" href="" className="text-brand-darkBlue underline underline-offset-2">
                                            Internet system for a money transfer in English
                                        </a>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </ClientLayout >
    );
}
