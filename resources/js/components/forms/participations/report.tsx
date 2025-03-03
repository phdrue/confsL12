import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, WandSparkles } from 'lucide-react';
import { FormEventHandler, useState, ChangeEvent } from 'react';
import { Author, ConferenceType } from '@/types/conferences';
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
import AuthorsFormPartial from './authors';
import { Country } from '@/types/other';

export default function ReportParticipationForm({
    countries
}: {
    countries: Array<Country>
}) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset } = useForm({
        'type_id': '',
        'report_type_id': '',
        'topic': '',
        'text': '',
        'literature': '',
        'authors': Array(0),
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Подать доклад</Button>
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
                        <AuthorsFormPartial countries={countries} setData={setData} authors={data.authors} errors={errors} />
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
