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
import { Country, Report } from '@/types/other';
import { Conference, ReportType } from "@/types/conferences";
import InputError from "@/components/input-error";
import ReportParticipationForm from "./report";
import ThesisParticipationForm from "./thesis";

export default function ParticipationForm({
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
        'authorization': '',
        'reports': Array(0),
        'thesises': Array(0),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('client.conferences.participate', conference.id), {
            onError: (err) => {
                if (err.authorization) {
                    toast({
                        variant: 'destructive',
                        title: 'Нельзя изменить данные',
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
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex gap-2">
                    <Button className="w-max">Участвовать</Button>
                    {Boolean(conference.allow_report) &&
                        <Button className="w-max" variant={"brandRed"}>Подать доклад</Button>
                    }
                    {Boolean(conference.allow_thesis) &&
                        <Button className="w-max" variant={"brandDarkBlue"}>Подать тезисы</Button>
                    }
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Регистрация</DialogTitle>
                    <DialogDescription>
                        Заполните основные поля, содержание позде
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <ReportParticipationForm setData={setData} errors={errors} reports={data.reports} conference={conference} reportTypes={reportTypes} countries={countries} />
                        <ThesisParticipationForm setData={setData} errors={errors} thesises={data.thesises} conference={conference} countries={countries} />
                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Зарегистрироваться
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
