import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Footer from '@/components/landing/footer';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Стартовая страница',
        href: route('home'),
    },
    {
        title: 'Рассылка',
        href: route('subscribe'),
    },
];

const options = [
    { id: "1", label: "Акушерство и гинекология" },
    { id: "2", label: "Хирургия" },
    { id: "3", label: "Гуманитарные науки" },
    { id: "4", label: "Фармация" },
    { id: "5", label: "Биотехнологии" },
    { id: "6", label: "Биофизика, математика, статистика" },
    { id: "7", label: "Терапия" },
    { id: "8", label: "Морфология: нормальная и патологическая" },
    { id: "9", label: "Биология, генетика, биохимия" },
    { id: "10", label: "Физиология: нормальная и патологическая" },
    { id: "11", label: "Инфекционные болезни / эпидемиология / гигиена / микробиология" },
    { id: "12", label: "Диагностика" },
    { id: "13", label: "Анестезиология и реаниматология / медицина катастроф" },
    { id: "14", label: "Психиатрия / наркология" },
    { id: "15", label: "Неврология" },
    { id: "16", label: "Онкология" },
    { id: "17", label: "Организация здравоохранения и фармдела" },
    { id: "18", label: "Оториноларингология" },
    { id: "19", label: "Офтальмология" },
    { id: "20", label: "Педиатрия" },
    { id: "21", label: "Реабилитация / спортивная и авиакосмическая медицина" },
    { id: "22", label: "Стоматология" },
    { id: "23", label: "Судебная медицина" },
    { id: "24", label: "Травматология и ортопедия" },
    { id: "25", label: "Урология" },
    { id: "26", label: "Фармакология / клиническая фармакология" },
];

export default function subscribe({ }) {
    const { toast } = useToast()
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        options: selectedOptions
    });

    // Handle checkbox change
    const handleCheckboxChange = (id: string) => {
        setSelectedOptions((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id)
            } else {
                return [...prev, id]
            }
        })
    }

    // Handle "Select All" functionality
    const handleSelectAll = () => {
        if (selectedOptions.length === options.length) {
            setSelectedOptions([])
        } else {
            setSelectedOptions(options.map((option) => option.id))
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        toast({
            variant: "success",
            title: "Кнопка подписки была нажат!",
        })

        // post(route('adm.conferences.store'), {
        //     forceFormData: true,
        //     onSuccess: () => {
        //         handleClose()
        //         toast({
        //             variant: "success",
        //             title: "Конференция успешно создана!",
        //         })
        //         reset()
        //     }
        // })
    };

    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title="Рассылка" />
            <div className="mx-auto max-w-screen-xl pt-16 mb-24 w-full">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-16">
                    <h1 className="text-center text-3xl sm:text-4xl font-semibold">Рассылка</h1>
                </div>
                <div className="flex flex-col gap-16 px-4 sm:px-6">
                    <div className="text-center">
                        <h2 className="text-base/7 font-semibold">
                            Форма подписки на рассылку “Медицинская наука: конференции, гранты, форумы, конкурсы”
                        </h2>
                        <p className="mt-1 max-w-2xl text-sm/6 text-muted-foreground mx-auto">
                            Здравствуйте, уважаемый коллега!
                            <span className="block">
                                Мы благодарим Вас за принятое решение подписаться на рассылку научных новостей Курского государственного медицинского университета и надеемся на участие в наших будущих проектах!
                            </span>
                            <span className="block">Отписаться от рассылки можно в любое время, пройдя по ссылке в любом из писем.</span>
                            <span className="block">Нажимая кнопку «Отправить», Вы соглашаетесь с Правилами обработки персональных данных</span>
                        </p>
                    </div>
                    <div className="">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Button type="button" variant="outline" onClick={handleSelectAll} className="text-sm">
                                        {selectedOptions.length === options.length ? "Удалить все" : "Выбрать все"}
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        {selectedOptions.length} из {options.length} выбрано
                                    </span>
                                </div>
                                <div className="grid gap-2 max-w-md">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={1}
                                        value={data.date}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {options.map((option) => (
                                        <div key={option.id} className="flex items-center space-x-2 border p-3 rounded-md">
                                            <Checkbox
                                                id={option.id}
                                                checked={selectedOptions.includes(option.id)}
                                                onCheckedChange={() => handleCheckboxChange(option.id)}
                                            />
                                            <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                                                {option.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>

                                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Подписаться
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </ClientLayout >
    );
}
