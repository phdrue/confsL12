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
import options from '@/components/forms/proposals/options';

export default function ProposalCreateForm({ }) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const [selectedAudiences, setSelectedAudiences] = useState<string[]>([])

    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        name: '',
        shortName: '',
        engName: '',
        engShortName: '',
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
        audiences: selectedAudiences,
        bookType: '',
        topics: '',
        budget: '',
        budgetSource: '',
        coverageInPerson: '',
        coverageOnline: '',
        coverageProfession: '',
        img: null as File | null,
    });

    transform((data) => ({
        ...data,
        audiences: selectedAudiences,
    }))

    const handleAudiencesCheckboxChange = (audience: string) => {
        setSelectedAudiences((prev) => {
            if (prev.includes(audience)) {
                return prev.filter((item) => item !== audience)
            } else {
                return [...prev, audience]
            }
        })
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setData('img', file)
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('adm.proposals.store'), {
            forceFormData: true,
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: "Предложение успешно создана!",
                })
                reset()
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogTrigger asChild>
                <Button variant="outline">Предложить</Button>
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
                            <Label htmlFor="name">Полное название RUS</Label>
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
                            <Label htmlFor="shortName">Краткое название RUS</Label>
                            <Textarea
                                id="shortName"
                                name="shortName"
                                value={data.shortName}
                                className="w-full"
                                autoComplete="shortName"
                                onChange={(e) => setData('shortName', e.target.value)}
                            />
                            <InputError message={errors.shortName} className="mt-2" />
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
                            <Label htmlFor="engShortName">Краткое название ENG</Label>
                            <Textarea
                                id="engShortName"
                                name="engShortName"
                                value={data.engShortName}
                                className="w-full"
                                autoComplete="engShortName"
                                onChange={(e) => setData('engShortName', e.target.value)}
                            />
                            <InputError message={errors.engShortName} className="mt-2" />
                        </div>
                        <div className="space-2">
                            <Label htmlFor="level">Уровень мероприятия</Label>
                            <Select required name="level" value={data.level} onValueChange={(level) => setData('level', level)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид конференции" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* <SelectGroup> */}
                                    {/* <SelectLabel>Виды</SelectLabel> */}
                                    {options.levels.map((level) => (
                                        <SelectItem key={level} value={level}>{level}</SelectItem>
                                    ))}
                                    {/* </SelectGroup> */}
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
                                type="date"
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
                            <Label htmlFor="coverageInPerson">Предполагаемое количество участников (очно)</Label>
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
                            <Label htmlFor="coverageOnline">Предполагаемое количество участников (дистанционно)</Label>
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
                            <Label htmlFor="coverageProfession">Предполагаемое количество участников (профессиональное сообщество)</Label>
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
                            <Label htmlFor="audiences">Целевая аудитория</Label>
                            {options.audiences.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
                                    <Checkbox
                                        id={`audience${index}`}
                                        checked={selectedAudiences.includes(option)}
                                        onCheckedChange={() => handleAudiencesCheckboxChange(option)}
                                    />
                                    <Label htmlFor={`audience${index}`} className="flex-1 cursor-pointer">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                            <InputError message={errors.audiences} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="img">Изображение (опционально)</Label>
                            {data.img && (
                                <div className="w-full max-w-[300px] aspect-video bg-gray-100 rounded-md overflow-hidden">
                                    <img 
                                        className="w-full h-full object-cover" 
                                        alt="Preview" 
                                        src={URL.createObjectURL(data.img)} 
                                    />
                                </div>
                            )}
                            <Input
                                id="img"
                                name="img"
                                type="file"
                                accept="image/*"
                                className="w-full"
                                autoComplete="img"
                                onChange={handleFileChange}
                            />
                            <InputError message={errors.img} className="mt-2" />
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Предложить
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
