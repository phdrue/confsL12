import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, WandSparkles } from 'lucide-react';
import { FormEventHandler, useState, ChangeEvent } from 'react';
import { ConferenceType } from '@/types/conferences';
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

export default function CreateConferenceForm({
    types
}: { types: Array<ConferenceType> }) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        primary_color: '',
        type_id: '',
        date: '',
        allow_thesis: false as boolean,
        allow_report: false as boolean,
        img: null as File | null
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('adm.conferences.store'), {
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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setData('img', file)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Создать</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Создание конференции</DialogTitle>
                    <DialogDescription>
                        Заполните основные поля, содержание позде
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="type_id">Вид конференции</Label>
                            <Select name="type_id" value={data.type_id} onValueChange={(type_id) => setData('type_id', type_id)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид конференции" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {types.map((type) => (
                                            <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type_id} className="mt-2" />
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
                        <div className="grid gap-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={data.description}
                                className="w-full"
                                autoComplete="description"
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="primary_color">Основной цвет</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    id="primary_color"
                                    name="primary_color"
                                    value={data.primary_color}
                                    className="w-full"
                                    autoComplete="primary_color"
                                    onChange={(e) => setData('primary_color', e.target.value)}
                                />
                                <Button
                                    onClick={() => setData('primary_color', '#548FC7')}
                                    type="button"
                                    variant={"outline"}
                                    size={"iconSmall"}>
                                    <WandSparkles className="text-pink-500" />
                                </Button>
                            </div>
                            <InputError message={errors.primary_color} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="img">Основная картинка</Label>
                            <Input
                                id="img"
                                name="img"
                                type="file"
                                className="w-full"
                                autoComplete="img"
                                onChange={handleFileChange}
                            />
                            <InputError message={errors.img} className="mt-2" />
                        </div>
                        <div className="flex items-center space-x-3">
                            <Checkbox id="allow_report" checked={data.allow_report} onCheckedChange={(e) => setData('allow_report', e === true)} name="allow_report" tabIndex={3} />
                            <Label htmlFor="allow_report">Можно доклад</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Checkbox id="allow_thesis" checked={data.allow_thesis} onCheckedChange={(e) => setData('allow_thesis', e === true)} name="allow_thesis" tabIndex={3} />
                            <Label htmlFor="allow_thesis">Можно тезис</Label>
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
