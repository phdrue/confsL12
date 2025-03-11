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

export default function RegularParticipationForm({
    conference,
}: {
    conference: Conference,
}) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset } = useForm({
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('client.conferences.participate', conference.id), {
            onError: (err) => {
                toast({
                    variant: 'destructive',
                    title: 'Вы уже участвуете в конференции',
                })
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
                <Button className="w-max">Участвовать</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Регистрация</DialogTitle>
                    <DialogDescription>
                        Заполните основные поля, содержание позде
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
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
