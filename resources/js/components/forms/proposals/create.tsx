import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, WandSparkles } from 'lucide-react';
import { FormEventHandler, useState, ChangeEvent } from 'react';
import { ConferenceType, Proposal } from '@/types/conferences';
import { useToast } from "@/hooks/use-toast"

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const options = {
    levels: [
        "Международный", "Федеральный", "Региональный", "Университетский", "Кафедральный", "Другое"
    ],
    forms: [
        "Очная", "Дистанционная", "Гибридная"
    ],
    types: [
        "Научная", "Научно-практическая", "Учебно-методическая", "Другое"
    ],
    langs: [
        "Русский", "Английский", "Другое"
    ],
    audiences: [
        "Школьники", "Студенты", "Слушатели системы последипломного образования (аспиранты, ординаторы, курсанты)", "Представители академического сообщества (профессорско-преподавательский состав, научные работники)", "Работники практического здравоохранения"
    ],
    bookTypes: [
        "На электронном носителе", "На бумажном носителе", "Выпуск сборника не предполагается"
    ],
    budgets: [
        "менее 50 000 рублей", "50 000 - 100 000 рублей", "100 000 - 200 000 рублей", "200 000 – 500 000 рублей", "более 500 000 рублей"
    ],
    budgetSources: [
        "Оргвзносы участников", "Реклама, выставка, доклады и т.п. представителей медицинского и фармацевтического бизнеса", "Средства заказчика (заказчиков) мероприятия", "Спонсорская помощь", "Гранты", "Ресурсы КГМУ"
    ],
}

export default function ProposalCreateForm({ }) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        engName: '',
        level: '',
        form: '',
        type: '',
        lang: '',
        date: '',
        endDate: '',
        place: '',
        department: '',
        organization: '',
        organizationOther: '',
        participationsTotal: '',
        participationsForeign: '',
        audience: '',
        bookType: '',
        topics: '',
        amenities: '',
        budget: '',
        budgetSource: '',
        coverageInPerson: '',
        coverageOnline: '',
        coverageProfession: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('adm.proposals.store'), {
            forceFormData: true,
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: "Конференция успешно создана!",
                })
                reset()
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Создать</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Предложить конференцию</DialogTitle>
                    <DialogDescription>
                        Заполните поля
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Название RUS</Label>
                            <Textarea
                                id="name"
                                name="name"
                                value={data.name}
                                className="w-full"
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="engName">Название ENG</Label>
                            <Textarea
                                id="engName"
                                name="engName"
                                value={data.engName}
                                className="w-full"
                                autoComplete="engName"
                                onChange={(e) => setData('engName', e.target.value)}
                            />
                            <InputError message={errors.engName} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="level">Уровень мероприятия</Label>
                            <Select name="level" value={data.level} onValueChange={(level) => setData('level', level)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид конференции" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {options.levels.map((level) => (
                                            <SelectItem key={level} value={level}>{level}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.level} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="form">Форма проведения мероприятия</Label>
                            <Select name="form" value={data.form} onValueChange={(form) => setData('form', form)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид конференции" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {options.forms.map((form) => (
                                            <SelectItem key={form} value={form}>{form}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.form} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Вид мероприятия</Label>
                            <Select name="type" value={data.type} onValueChange={(type) => setData('type', type)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид конференции" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {options.types.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lang">Язык конференции</Label>
                            <Select name="lang" value={data.lang} onValueChange={(lang) => setData('lang', lang)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид конференции" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {options.langs.map((lang) => (
                                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.lang} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Дата</Label>
                            <Input
                                id="date"
                                type="date"
                                required
                                tabIndex={1}
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="endDate">Дата окончания</Label>
                            <Input
                                id="endDate"
                                type="endDate"
                                required
                                tabIndex={1}
                                value={data.endDate}
                                onChange={(e) => setData('endDate', e.target.value)}
                            />
                            <InputError message={errors.endDate} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="place">Название учреждения места проведения, почтовый индекс, почтовый адрес</Label>
                            <Textarea
                                id="place"
                                name="place"
                                value={data.place}
                                className="w-full"
                                autoComplete="place"
                                onChange={(e) => setData('place', e.target.value)}
                            />
                            <InputError message={errors.place} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="department">Кафедра(ы) (структурное(ые) подразделение(ия) - ИНИЦИАТОР(Ы) мероприятия </Label>
                            <Textarea
                                id="department"
                                name="department"
                                value={data.department}
                                className="w-full"
                                autoComplete="department"
                                onChange={(e) => setData('department', e.target.value)}
                            />
                            <InputError message={errors.department} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="organization">Учреждение - ОРГАНИЗАТОР мероприятия </Label>
                            <Textarea
                                id="organization"
                                name="organization"
                                value={data.organization}
                                className="w-full"
                                autoComplete="organization"
                                onChange={(e) => setData('organization', e.target.value)}
                            />
                            <InputError message={errors.organization} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="organizationOther">Учреждение(я) – СООРГАНИЗАТОР(Ы) мероприятия </Label>
                            <Textarea
                                id="organizationOther"
                                name="organizationOther"
                                value={data.organizationOther}
                                className="w-full"
                                autoComplete="organizationOther"
                                onChange={(e) => setData('organizationOther', e.target.value)}
                            />
                            <InputError message={errors.organizationOther} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="participationsTotal">Предполагаемое количество ВСЕХ участников </Label>
                            <Input
                                id="participationsTotal"
                                type="text"
                                required
                                tabIndex={1}
                                value={data.participationsTotal}
                                onChange={(e) => setData('participationsTotal', e.target.value)}
                            />
                            <InputError message={errors.participationsTotal} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="participationsForeign">Предполагаемое количество ИНОГОРОДНИХ участников </Label>
                            <Input
                                id="participationsForeign"
                                type="text"
                                required
                                tabIndex={1}
                                value={data.participationsForeign}
                                onChange={(e) => setData('participationsForeign', e.target.value)}
                            />
                            <InputError message={errors.participationsForeign} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bookType">Формат выпуска сборника тезисов (материалов) конференции </Label>
                            <Select name="bookType" value={data.bookType} onValueChange={(bookType) => setData('bookType', bookType)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид конференции" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {options.bookTypes.map((bookType) => (
                                            <SelectItem key={bookType} value={bookType}>{bookType}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.bookType} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="topics">Основные направления работы конференции</Label>
                            <Textarea
                                id="topics"
                                name="topics"
                                value={data.topics}
                                className="w-full"
                                autoComplete="topics"
                                onChange={(e) => setData('topics', e.target.value)}
                            />
                            <InputError message={errors.topics} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="budget">Укажите примерный предполагаемый бюджет мероприятия </Label>
                            <Select name="budget" value={data.budget} onValueChange={(budget) => setData('budget', budget)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид конференции" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {options.budgets.map((budget) => (
                                            <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.budget} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="budgetSource">За счет каких источников планируете формировать бюджет конференции?</Label>
                            <Select name="budgetSource" value={data.budgetSource} onValueChange={(budgetSource) => setData('budgetSource', budgetSource)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид конференции" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {options.budgetSources.map((budgetSource) => (
                                            <SelectItem key={budgetSource} value={budgetSource}>{budgetSource}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.budgetSource} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="coverageInPerson">Охват участников (очно)</Label>
                            <Input
                                id="coverageInPerson"
                                type="text"
                                required
                                tabIndex={1}
                                value={data.coverageInPerson}
                                onChange={(e) => setData('coverageInPerson', e.target.value)}
                            />
                            <InputError message={errors.coverageInPerson} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="coverageOnline">Охват участников (дистанционно)</Label>
                            <Input
                                id="coverageOnline"
                                type="text"
                                required
                                tabIndex={1}
                                value={data.coverageOnline}
                                onChange={(e) => setData('coverageOnline', e.target.value)}
                            />
                            <InputError message={errors.coverageOnline} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="coverageProfession">Охват профессионального сообщества</Label>
                            <Input
                                id="coverageProfession"
                                type="text"
                                required
                                tabIndex={1}
                                value={data.coverageProfession}
                                onChange={(e) => setData('coverageProfession', e.target.value)}
                            />
                            <InputError message={errors.coverageProfession} />
                        </div>


                        <div className="grid gap-2">
                            <Label htmlFor="name">Название</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                tabIndex={1}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>



                        <div className="flex items-center space-x-3">
                            <Checkbox id="allow_report" checked={data.allow_report} onCheckedChange={(e) => setData('allow_report', e === true)} name="allow_report" tabIndex={3} />
                            <Label htmlFor="allow_report">Можно доклад</Label>
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Создать
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
