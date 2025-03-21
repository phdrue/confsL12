import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, WandSparkles } from 'lucide-react';
import { FormEventHandler, useState, ChangeEvent } from 'react';
import { Author, Conference, ConferenceType, ReportType } from '@/types/conferences';
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

export default function ThesisParticipationForm({
    conference,
    countries
}: {
    conference: Conference,
    countries: Array<Country>
}) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset } = useForm({
        'type_id': 2,
        // 'full_name': '',
        'topic': '',
        'text': '',
        'literature': '',
        'authors': Array(0),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('client.conferences.submit-document', conference.id), {
            forceFormData: true,
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: "Тезисы успешно поданы!",
                })
                reset()
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-max" variant={"brandDarkBlue"}>Подать тезисы</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Подача тезисов</DialogTitle>
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
                            <Label htmlFor="topic">Тема тезисов</Label>
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
                        <div className="grid gap-2">
                            <Label htmlFor="text">Полный текст {data.text.length} / 23000</Label>
                            <Textarea
                                id="text"
                                maxLength={23000}
                                name="text"
                                value={data.text}
                                className="w-full"
                                autoComplete="text"
                                required
                                onChange={(e) => setData('text', e.target.value)}
                            />
                            <InputError message={errors.text} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="literature">Список литературы {data.literature.length} / 23000</Label>
                            <Textarea
                                id="literature"
                                maxLength={23000}
                                name="literature"
                                value={data.literature}
                                className="w-full"
                                autoComplete="literature"
                                required
                                onChange={(e) => setData('literature', e.target.value)}
                            />
                            <InputError message={errors.literature} className="mt-2" />
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
                            Подать тезисы
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
