import ClientLayout from '@/layouts/client-layout';
import Footer from '@/components/landing/footer';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Стартовая страница',
        href: route('home'),
    },
    {
        title: 'Требования к тезисам',
        href: route('thesis.requirements'),
    },
];

export default function ThesisRequirements() {
    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title="Требования к тезисам" />

            <div className="mx-auto max-w-screen-xl pt-16 mb-24 w-full">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-16">
                    <h1 className="text-center text-3xl sm:text-4xl font-semibold">
                        Требования к тексту тезисов
                    </h1>
                    <p className="mt-4 text-center text-sm/6 text-muted-foreground">
                        Тезисы, направляемые для публикации в сборнике материалов конференции.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="rounded-xl border border-border/60 bg-white p-6 sm:p-8">
                        <h2 className="text-base/7 font-semibold">
                            Основные требования
                        </h2>
                        <ul className="mt-4 list-disc pl-5 space-y-2 text-sm/6 text-muted-foreground">
                            <li>
                                К публикации принимаются оригинальные материалы по основным направлениям конференции.
                            </li>
                            <li>
                                Материалы принимаются в объеме, эквивалентном 1–3 страницам текста (формат А4, размер
                                шрифта 14, одинарный межстрочный интервал).
                            </li>
                            <li>
                                Число соавторов тезиса или статьи не должно превышать пяти человек. Увеличение количества
                                соавторов возможно в отдельных случаях по решению оргкомитетов.
                            </li>
                            <li>
                                Ссылки на литературные источники оформляются строго по ГОСТу.
                            </li>
                            <li>
                                Тезисы докладов имеют текстовый формат и не могут содержать графический материал (таблиц
                                и рисунков).
                            </li>
                            <li>
                                Материалы должны представлять краткое сообщение, содержащее цель, методы исследования,
                                изложение полученных результатов, список использованной литературы.
                            </li>
                            <li>
                                Сокращения по тексту должны иметь расшифровку.
                            </li>
                            <li>
                                Оригинальность текста должна быть не менее 70%.
                            </li>
                        </ul>

                        <div className="mt-8 rounded-lg bg-muted/30 p-4 sm:p-5">
                            <p className="text-sm/6 text-muted-foreground">
                                Правила для опубликования полнотекстовых сообщений размещены в разделе «Для авторов»
                                научных журналов, выпускаемых Курским государственным медицинским университетом.
                            </p>
                        </div>

                        <div className="mt-8">
                            <p className="text-sm/6 text-muted-foreground">
                                Будем рады слышать Ваши доклады на наших конференциях и видеть результаты Ваших
                                исследований на страницах сборников материалов и журналов Курского государственного
                                медицинского университета.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </ClientLayout>
    );
}

