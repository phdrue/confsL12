import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Copy, NavigationIcon, PaperclipIcon, Share2Icon } from "lucide-react";

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

export default function Proj({ }) {
    return (
        <ClientLayout>
            <Head title="Мероприятия" />
            <div className="font-lato mx-auto max-w-[1216px] w-full mt-24 mb-48 px-4 md:px-16 lg:px-0 space-y-6">
                {/* breadcrumbs */}
                {/* photos */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex overflow-hidden lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-2 h-[357px] md:h-[724px] lg:h-[516px]">
                        <div className="rounded-xl overflow-hidden w-full shrink-0">
                            <img className="size-full object-cover" src="https://s3-alpha-sig.figma.com/img/e99c/8176/cd11ad3ea5940085df8f6ed7dd5a5dbe?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=F86j5jEuU-dAAWcKBFEtpjNociFfsQ5rCHO-vulqxbmvKEgPRncO0OXRsTpiiCD7TsqEido63eSlvLYBoelF~uiQgvqQknJPEhtWUrQaNBpZ~00Ifq~ybEwS4JzRDaQQDFOaTmtjjYraA-CuKkljLzzYYtsLZnjpigIEWZNYG04rN9cak7QUmKkOFqdzBtq0TMPrRyrb0EcqgGMWygUBSHphKMDqD3ipasaN2LGceZyB9T379jJeKJi53QwhtidVCN98ZXmHZHiqHQdcvN-3d0s2Jo0AC81O5f9S4cbNRn01HsXAhxXMXZ9b6gzE-MTrN-QJV0Ba5MtCLG5S0JSKUA__" alt="" />
                        </div>
                        <div className="lg:col-span-2 lg:row-span-2 rounded-xl overflow-hidden w-full shrink-0">
                            <img className="size-full object-cover" src="https://s3-alpha-sig.figma.com/img/326c/7c78/0a2053e350a307a6433080b377530eab?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=JQ3TTSdlp8gtEkW0HmFG0r238~ThShe6rO0KOkfpum69flyPymmI0qutingPjSXaGHCq8OK7QA~2JHAsYX~p0qfG85TlPJSR5BnL945n1uOxwS-rkv9fTIw6ZC9IRAHZemHVJd4XLA70NzPNaKrmJbvax5VoRWPn12Z3vAD~sef2j9ghKM56VpWzq9ts4d948bJpmYrZ~bVI5oWX9~UDbTorOXTNj8wLYdiba2K6AJPhByviv~rgcu7JtCxWFPcwiXGom5WustKUuE3egIu143FwVRRatFk0ypAnb5VRUdP6LEI-ZNs4PH70GGBNGdymPzDrjz~zTAO-fFf3XGMgMQ__" alt="" />
                        </div>
                        <div className="rounded-xl overflow-hidden w-full shrink-0">
                            <img className="size-full object-cover" src="https://s3-alpha-sig.figma.com/img/08b0/608c/e1ce1c293e4f609a01a0771e93594ff5?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=L71XIUeHn2TFZAZpc8NWdnoBvL3jMz4JE7r-htlOehadHs09tIRqhYcb8y9JsvYUNQgX2uwZrBSo742v65S4VRnkSorHwA~f8WN-IyMnVy-tafP-lpv7ccMni2eiedE5WuuSrzvTf~2beFirz0~nfa2Sr1-LgqM~9rLb543H3exZU7LFYcd9mqEptF4YE9A4t89Y0KU7~1PgGoW-T3aKa99ygC291GDWF~4zBiGdbU~ZvHxCf9-cnxnmx60ePHRGzLBd5XU391sZnRoy8vB3nWWhQcexQ4NmLjeBa9h2UP8A4cwZATc4DmBAEt~ubjsSPGy-y6oT2qCUEohnMzN59w__" alt="" />
                        </div>
                    </div>
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h2 className="font-bold text-xl md:text-[32px]/[40px]">Разработка сайта гумпомощь</h2>
                            <p>Нам нужна помощь в создании сайта с картами пунктами выдачи бесплатной одежды.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="h-[52px] py-[14px] px-[24px] md:px-[40px] border-2 rounded-[8px] flex items-center justify-center text-red-600 border-red-600">
                                Предложить
                            </button>
                            <button className="size-[52px] border-2 rounded-[8px] aspect-square flex items-center justify-center text-blue-600 border-blue-600">
                                <Share2Icon size={24} />
                            </button>
                            <button className="size-[52px] border-2 rounded-[8px] aspect-square flex items-center justify-center text-blue-600 border-blue-600">
                                <Copy size={24} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* text */}
                <div className="space-y-4">
                    <h4 className="font-bold text-xl md:text-[24px]/[32px]">Описание</h4>
                    <div>
                        <p>Нам нужна помощь в создании сайта для пунктов выдачи бесплатной одежды. Мы стремимся сделать его удобным для пользователей и эффективным для нашей команды волонтеров и партнеров.</p>
                        <br />
                        <p>Основные задачи:</p>
                        <p>Интуитивно понятный интерфейс для поиска и выбора пунктов выдачи:</p>
                        <ul>
                            <li className="pl-2">
                                - Удобная навигация для быстрого нахождения нужного пункта.
                            </li>
                            <li className="pl-2">
                                - Логичное расположение информации о часах работы и контактных данных.
                            </li>
                            <li className="pl-2">
                                - Поддержка мобильных устройств для пользователей на ходу.
                            </li>
                        </ul>
                        <br />
                        <p>Основные задачи:</p>
                        <ul>
                            <li className="pl-2">
                                - Удобная навигация для быстрого нахождения нужного пункта.
                            </li>
                            <li className="pl-2">
                                - Логичное расположение информации о часах работы и контактных данных.
                            </li>
                            <li className="pl-2">
                                - Поддержка мобильных устройств для пользователей на ходу.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
            <Footer />
        </ClientLayout >
    );
}

function Footer({ }) {
    return (
        <div className="w-full font-lato bg-[#EFF5F9] py-16">
            <div className="mx-auto max-w-[1216px] w-full gap-8 px-4 md:px-16 lg:px-0 flex flex-col lg:flex-row text-[#66727F]">
                <div className="flex flex-col gap-4 text-lg w-full">
                    <span className="text-h1">Главная</span>
                    <span>Новости</span>
                    <span>АСКОП</span>
                </div>
                <div className="flex flex-col gap-4 text-lg w-full">
                    <span>Онлайн-касса</span>
                    <span>О нас</span>
                    <span>Контакты</span>
                </div>
                <div className="flex flex-col gap-4 text-lg w-full">
                    <span>Личный кабинет</span>
                    <span className="flex gap-2 items-center"><NavigationIcon size={20} /> г.Курск</span>
                </div>
                <div className="flex gap-4">
                    <Button className="rounded-[12px] bg-[#86909C]" size={"icon"}><NavigationIcon /></Button>
                    <Button className="rounded-[12px] bg-[#86909C]" size={"icon"}><NavigationIcon /></Button>
                    <Button className="rounded-[12px] bg-[#86909C]" size={"icon"}><NavigationIcon /></Button>
                    <Button className="rounded-[12px] bg-[#86909C]" size={"icon"}><NavigationIcon /></Button>
                </div>
            </div>
        </div>
    )
}
