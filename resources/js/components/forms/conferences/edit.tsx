import { Conference, ConferenceType } from "@/types/conferences"
import { useState, ChangeEvent } from "react"
import { useForm } from "@inertiajs/react"
import { useToast } from "@/hooks/use-toast"
import { WandSparkles, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"


export default function EditConferenceForm({
    conference,
    types
}: { conference: Conference, types: Array<ConferenceType> }) {
    const { toast } = useToast()
    const dateParts = conference.date.split('.')

    const { data, setData, post, reset, processing, errors } = useForm({
        authorization: undefined,
        name: conference.name,
        description: conference.description,
        primary_color: conference.primary_color,
        type_id: conference.type_id,
        date: `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`,
        allow_thesis: conference.allow_thesis,
        allow_report: conference.allow_report,
        img: null as File | null,
        _method: 'put'
    })

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        post(route('adm.conferences.update', conference.id), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Конференция успешно обновлена!",
                })
                reset('img')
            },
            onError: (err) => {
                if (err.authorization) {
                    toast({
                        variant: 'destructive',
                        title: 'Нельзя изменить данные',
                    })
                }
            }
        })
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setData('img', file)
    }

    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Редактирование конференции</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="">
                    <div className="w-full mx-auto py-0">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="type_id">Вид конференции</Label>
                                    <Select name="type_id" value={String(data.type_id)} onValueChange={(type_id) => setData('type_id', Number(type_id))}>
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
                                    <div className="self-center aspect-[584/384] w-full max-w-[584px] bg-white rounded-md overflow-hidden">
                                        <img className="size-full object-cover" alt="" src={`/storage/${conference.img_path}`} />
                                    </div>
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
                                    <Checkbox id="allow_report" checked={Boolean(data.allow_report)} onCheckedChange={(e) => setData('allow_report', e === true)} name="allow_report" tabIndex={3} />
                                    <Label htmlFor="allow_report">Можно доклад</Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Checkbox id="allow_thesis" checked={Boolean(data.allow_thesis)} onCheckedChange={(e) => setData('allow_thesis', e === true)} name="allow_thesis" tabIndex={3} />
                                    <Label htmlFor="allow_thesis">Можно тезис</Label>
                                </div>

                                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Обновить
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}
