import AuthorsFormPartial from '@/components/forms/participations/authors';
import ConsentDialog from '@/components/forms/participations/consent-dialog';
import DraftDocumentList, { DraftDocumentItem } from '@/components/forms/participations/draft-document-list';
import ScienceGuidesFormPartial from '@/components/forms/participations/science-guides';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ReportType } from '@/types/conferences';
import { Country, Degree, Report, ScienceGuide, Title } from '@/types/other';
import { FormEventHandler, useState } from 'react';

type ReportForm = {
    topic: string;
    report_type_id: string;
    authors: Array<never>;
    science_guides: Array<ScienceGuide>;
};

const emptyReport = (): ReportForm => ({
    topic: '',
    report_type_id: '',
    authors: [],
    science_guides: [],
});

export default function ReportStep({
    participation,
    countries,
    degrees,
    titles,
    reportTypes,
    reports,
    onBack,
    onAdd,
    onDelete,
}: {
    participation?: { id: number; confirmed: boolean } | null;
    countries: Array<Country>;
    degrees: Array<Degree>;
    titles: Array<Title>;
    reportTypes: Array<ReportType>;
    reports: Array<Report & { key: string }>;
    onBack: () => void;
    onAdd: (report: ReportForm) => void;
    onDelete: (key: string) => void;
}) {
    const [deleteItem, setDeleteItem] = useState<DraftDocumentItem | null>(null);
    const [leaveOpen, setLeaveOpen] = useState(false);
    const [data, setData] = useState<ReportForm>(emptyReport);

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

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        if (!canAddReport) {
            return;
        }
        onAdd(data);
        setData(emptyReport());
    };

    return (
        <>
            <button
                type="button"
                className="text-sm text-muted-foreground underline-offset-2 hover:underline"
                onClick={() => (isDirty ? setLeaveOpen(true) : onBack())}
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
                    items={reports}
                    canDelete
                    onDelete={(item) => setDeleteItem(item)}
                />
            </div>

            <form className="mt-8 space-y-6" onSubmit={submit}>
                <AuthorsFormPartial
                    countries={countries}
                    setData={(authors) => setData((current) => ({ ...current, authors }))}
                    authors={data.authors}
                    errors={{}}
                />
                <ScienceGuidesFormPartial
                    scienceGuides={data.science_guides}
                    setData={(guides) => setData((current) => ({ ...current, science_guides: guides }))}
                    countries={countries}
                    degrees={degrees}
                    titles={titles}
                />
                <div className="grid gap-2">
                    <Label htmlFor="report_type_id">
                        Вид доклада <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        required
                        name="report_type_id"
                        value={data.report_type_id}
                        onValueChange={(value) => setData((current) => ({ ...current, report_type_id: value }))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите вид доклада" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Виды</SelectLabel>
                                {reportTypes.map((type) => (
                                    <SelectItem key={type.id} value={String(type.id)}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="topic">
                        Тема доклада <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="topic"
                        maxLength={2000}
                        value={data.topic}
                        required
                        onChange={(event) => setData((current) => ({ ...current, topic: event.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <Button type="submit" disabled={!canAddReport}>
                        Добавить в заявку
                    </Button>
                    {!canAddReport && (
                        <p className="text-sm text-muted-foreground">{getMissingFieldsMessage()}</p>
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
                    onDelete(deleteItem.key);
                    setDeleteItem(null);
                }}
            />
            <ConsentDialog
                open={leaveOpen}
                onOpenChange={setLeaveOpen}
                title="Покинуть форму?"
                description="Введённые данные не будут добавлены в заявку."
                confirmLabel="Покинуть"
                confirmVariant="destructive"
                onConfirm={onBack}
            />
        </>
    );
}
