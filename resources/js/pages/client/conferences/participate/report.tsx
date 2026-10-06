import ConsentDialog from '@/components/forms/participations/consent-dialog';
import DraftDocumentList, { DraftDocumentItem } from '@/components/forms/participations/draft-document-list';
import AuthorsFormPartial from '@/components/forms/participations/authors';
import ScienceGuidesFormPartial from '@/components/forms/participations/science-guides';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import ParticipationWizardLayout from './layout';
import { ParticipationWizardPageProps } from './types';

export default function ParticipationReportPage({
    conference,
    draft,
    participation,
    countries,
    degrees,
    titles,
    reportTypes,
}: ParticipationWizardPageProps) {
    const [deleteItem, setDeleteItem] = useState<DraftDocumentItem | null>(null);
    const [leaveOpen, setLeaveOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        topic: '',
        report_type_id: '',
        authors: [] as Array<never>,
        science_guides: [] as Array<never>,
    });

    const isTopicValid = data.topic.trim().length > 0 && data.topic.length <= 2000;
    const canAddReport = isTopicValid && data.report_type_id.length > 0 && data.authors.length > 0;
    const isDirty =
        data.topic.length > 0 ||
        data.report_type_id.length > 0 ||
        data.authors.length > 0 ||
        data.science_guides.length > 0;

    function getMissingFieldsMessage(): string {
        const missing: string[] = [];
        if (!isTopicValid) {
            missing.push('тему доклада');
        }
        if (!data.report_type_id) {
            missing.push('вид доклада');
        }
        if (data.authors.length === 0) {
            missing.push('добавить хотя бы одного автора');
        }

        return missing.length > 0 ? `Для добавления доклада необходимо заполнить: ${missing.join(', ')}` : '';
    }

    const goBack = () => router.visit(route('client.conferences.participation', conference.id));

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('client.conferences.participation.report.store', conference.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <ParticipationWizardLayout conference={conference} title="Добавить доклад">
            <button
                type="button"
                className="text-sm text-muted-foreground underline-offset-2 hover:underline"
                onClick={() => (isDirty ? setLeaveOpen(true) : goBack())}
            >
                Назад
            </button>

            <h1 className="mt-4 text-2xl font-semibold">Добавить доклад</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                После добавления доклад попадёт в заявку. Чтобы изменить документ, удалите его и добавьте заново.
            </p>

            <div className="mt-6">
                <h2 className="mb-2 text-base font-semibold">Уже в заявке</h2>
                <DraftDocumentList
                    items={draft.reports}
                    canDelete
                    onDelete={(item) => setDeleteItem(item)}
                />
            </div>

            <form className="mt-8 space-y-6" onSubmit={submit}>
                <AuthorsFormPartial countries={countries} setData={(authors) => setData('authors', authors)} authors={data.authors} errors={errors} />
                <InputError message={errors.authors} />
                <ScienceGuidesFormPartial
                    scienceGuides={data.science_guides}
                    setData={(guides) => setData('science_guides', guides)}
                    error={errors.science_guides}
                    countries={countries}
                    degrees={degrees}
                    titles={titles}
                />
                <div className="grid gap-2">
                    <Label htmlFor="report_type_id">Вид доклада <span className="text-red-500">*</span></Label>
                    <Select
                        required
                        name="report_type_id"
                        value={data.report_type_id}
                        onValueChange={(value) => setData('report_type_id', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите вид доклада" />
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
                    <InputError message={errors.report_type_id} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="topic">Тема доклада <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="topic"
                        maxLength={2000}
                        value={data.topic}
                        required
                        onChange={(event) => setData('topic', event.target.value)}
                    />
                    <InputError message={errors.topic} />
                </div>
                <InputError message={errors.authorization} />
                <div className="space-y-2">
                    <Button type="submit" disabled={processing || !canAddReport}>
                        Добавить в заявку
                    </Button>
                    {!canAddReport && (
                        <p className="text-sm text-muted-foreground">
                            {getMissingFieldsMessage()}
                        </p>
                    )}
                </div>
            </form>

            <ConsentDialog
                open={deleteItem !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteItem(null);
                    }
                }}
                title="Удалить доклад из заявки?"
                description={
                    participation
                        ? 'Этот доклад будет удалён из текущей версии заявки. Сохранённая заявка не изменится, пока вы не закончите подачу.'
                        : 'Этот доклад будет удалён из заявки.'
                }
                confirmLabel="Удалить"
                confirmVariant="destructive"
                onConfirm={() => {
                    if (!deleteItem) {
                        return;
                    }
                    router.delete(route('client.conferences.participation.report.destroy', {
                        conference: conference.id,
                        item: deleteItem.key,
                    }));
                }}
            />
            <ConsentDialog
                open={leaveOpen}
                onOpenChange={setLeaveOpen}
                title="Покинуть форму?"
                description="Введённые данные не будут добавлены в заявку."
                confirmLabel="Покинуть"
                confirmVariant="destructive"
                onConfirm={goBack}
            />
        </ParticipationWizardLayout>
    );
}
