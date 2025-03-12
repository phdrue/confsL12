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

    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
    const [selectedAudiences, setSelectedAudiences] = useState<string[]>([])

    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        engName: '',
        level: undefined,
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
        amenities: selectedAmenities,
        budget: '',
        budgetSource: '',
        coverageInPerson: '',
        coverageOnline: '',
        coverageProfession: '',
    });

    const handleAmenitiesCheckboxChange = (amenity: string) => {
        console.log(amenity)
        setSelectedAmenities((prev) => {
            console.log(prev)
            if (prev.includes(amenity)) {
                return prev.filter((item) => item !== amenity)
            } else {
                return [...prev, amenity]
            }
        })
    }

    const handleAudiencesCheckboxChange = (audience: string) => {
        setSelectedAudiences((prev) => {
            if (prev.includes(audience)) {
                return prev.filter((item) => item !== audience)
            } else {
                return [...prev, audience]
            }
        })
    }


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
    const [selectedValue, setSelectedValue] = useState<string | undefined>()
    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
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


                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Создать
                        </Button>
                    </div>
                </form>


                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (!selectedValue) {
                            alert("Please select a fruit before submitting")
                        } else {
                            alert(`You selected: ${selectedValue}`)
                        }
                    }}
                >
                    <div className="space-y-2">
                        <label htmlFor="standalone-select" className="text-sm font-medium">
                            Select a fruit <span className="text-destructive">*</span>
                        </label>
                        <Select required onValueChange={setSelectedValue} value={selectedValue}>
                            <SelectTrigger className="w-full" id="standalone-select">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="orange">Orange</SelectItem>
                                <SelectItem value="grape">Grape</SelectItem>
                                <SelectItem value="strawberry">Strawberry</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
