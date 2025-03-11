import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, WandSparkles } from 'lucide-react';
import { FormEventHandler, useState, ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast"

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
import AuthorsFormPartial from './authors';
import { Country } from '@/types/other';
import { Conference, ReportType } from "@/types/conferences";
import InputError from "@/components/input-error";

export default function ReportParticipationForm({
    conference,
    reportTypes,
    countries
}: {
    conference: Conference,
    reportTypes: Array<ReportType>,
    countries: Array<Country>
}) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset } = useForm({
        'type_id': 1,
        'report_type_id': '',
        // 'full_name': '',
        'topic': '',
        'authors': Array(0),
        'authorization': ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('client.conferences.submit-document', conference.id), {
            forceFormData: true,
            onError: (err) => {
                if (err.authorization) {
                    toast({
                        variant: 'destructive',
                        title: 'Вы уже участвуете в конференции',
                    })
                }
            },
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: "Доклад успешно подан!",
                })
                reset()
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-max" variant={"brandRed"}>Подать доклад</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Подача доклада</DialogTitle>
                    <DialogDescription>
                        Заполните основные поля, содержание позде
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div>
                            <AuthorsFormPartial countries={countries} setData={setData} authors={data.authors} errors={errors} />
                            <InputError message={errors.authors} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="report_type_id">Вид доклада</Label>
                            <Select
                                required={true}
                                name="report_type_id"
                                value={String(data.report_type_id)}
                                onValueChange={(report_type_id) => setData('report_type_id', report_type_id)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид конференции" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {reportTypes.map((type) => (
                                            <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.report_type_id} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="topic">Тема доклада</Label>
                            <Textarea
                                id="topic"
                                maxLength={2000}
                                name="topic"
                                value={data.topic}
                                className="w-full"
                                autoComplete="topic"
                                required
                                onChange={(e) => setData('topic', e.target.value)}
                            />
                            <InputError message={errors.topic} className="mt-2" />
                        </div>
                        {/* <div className="grid gap-2">
                            <Label htmlFor="full_name">Полное имя заявителя</Label>
                            <Input
                                id="full_name"
                                type="text"
                                required
                                tabIndex={1}
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                            />
                            <InputError message={errors.full_name} />
                        </div> */}
                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Подать доклад
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
