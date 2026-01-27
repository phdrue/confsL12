import { Head, useForm, router } from '@inertiajs/react';
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
    countries,
    participation,
    existingDocuments
}: {
    conference: Conference,
    reportTypes: Array<ReportType>,
    countries: Array<Country>,
    participation?: { id: number; confirmed: boolean } | null,
    existingDocuments?: { reports: Array<any>; thesises: Array<any> }
}) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()
    
    // Initialize form with existing documents if available
    const initialReports = existingDocuments?.reports?.map((doc: any) => ({
        id: doc.id,
        topic: doc.topic,
        report_type_id: String(doc.report_type_id),
        authors: doc.authors,
        science_guides: doc.science_guides || []
    })) || [];
    
    const initialThesises = existingDocuments?.thesises?.map((doc: any) => ({
        id: doc.id,
        topic: doc.topic,
        text: doc.text,
        literature: doc.literature,
        authors: doc.authors,
        science_guides: doc.science_guides || []
    })) || [];

    const { data, setData, post, processing, errors, reset } = useForm({
        'authorization': '',
        'reports': initialReports,
        'thesises': initialThesises,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const isExisting = !!participation;
        const confirmMessage = isExisting 
            ? "Вы уверены, что хотите обновить документы участия?"
            : "Вы уверены, что хотите зарегистрироваться и приложили все документы?";
        
        if (!confirm(confirmMessage)) {
            return;
        }
        
        // Prepare data without id fields (backend doesn't need them)
        const reportsWithoutId = data.reports.map(({ id, ...report }) => report);
        const thesisesWithoutId = data.thesises.map(({ id, ...thesis }) => thesis);
        
        // Create a temporary form instance with cleaned data
        const cleanedData = {
            authorization: data.authorization,
            reports: reportsWithoutId,
            thesises: thesisesWithoutId,
        };
        
        // Use router.post directly with the cleaned data
        router.post(route('client.conferences.participate', conference.id), cleanedData, {
            onError: (err) => {
                console.log(err)
                if (err.authorization) {
                    toast({
                        variant: 'destructive',
                        title: err.authorization,
                    })
                }
            },
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: isExisting 
                        ? "Документы успешно обновлены!"
                        : "Вы успешно зарегистрировались на конференцию!",
                })
                // Don't reset if editing existing participation
                if (!isExisting) {
                    reset()
                }
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex gap-2 flex-wrap">
                    {participation ? (
                        <>
                            <Button className="w-max">Управление документами</Button>
                            {Boolean(conference.allow_report) &&
                                <Button className="w-max" variant={"brandRed"}>Редактировать доклады</Button>
                            }
                            {Boolean(conference.allow_thesis) &&
                                <Button className="w-max" variant={"brandDarkBlue"}>Редактировать тезисы</Button>
                            }
                        </>
                    ) : (
                        <>
                            <Button className="w-max">Участвовать</Button>
                            {Boolean(conference.allow_report) &&
                                <Button className="w-max" variant={"brandRed"}>Подать доклад</Button>
                            }
                            {Boolean(conference.allow_thesis) &&
                                <Button className="w-max" variant={"brandDarkBlue"}>Подать тезисы</Button>
                            }
                        </>
                    )}
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{participation ? 'Управление документами' : 'Регистрация'}</DialogTitle>
                    <DialogDescription>
                        {participation 
                            ? 'Вы уже участвуете в конференции. Вы можете добавлять или удалять документы.'
                            : 'Если это разрешено в конференции, приложите свои документы'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        {Boolean(conference.allow_report) &&
                            <ReportParticipationForm setData={setData} errors={errors} reports={data.reports} conference={conference} reportTypes={reportTypes} countries={countries} />
                        }
                        <InputError message={errors.reports} className="mt-2" />
                        {Boolean(conference.allow_thesis) &&
                            <ThesisParticipationForm setData={setData} errors={errors} thesises={data.thesises} conference={conference} countries={countries} />
                        }
                        <InputError message={errors.thesises} className="mt-2" />
                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {participation ? 'Сохранить изменения' : 'Зарегистрироваться'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
