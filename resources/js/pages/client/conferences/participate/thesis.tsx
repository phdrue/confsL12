import AuthorsFormPartial from '@/components/forms/participations/authors';
import ConsentDialog from '@/components/forms/participations/consent-dialog';
import DraftDocumentList, { DraftDocumentItem } from '@/components/forms/participations/draft-document-list';
import ScienceGuidesFormPartial from '@/components/forms/participations/science-guides';
import RichTextEditor, { getPlainTextLength } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Country, Degree, ScienceGuide, Thesis, Title } from '@/types/other';
import { FormEventHandler, useState } from 'react';

type ThesisForm = {
    topic: string;
    text: string;
    literature: string;
    authors: Array<never>;
    science_guides: Array<ScienceGuide>;
};

const emptyThesis = (): ThesisForm => ({
    topic: '',
    text: '',
    literature: '',
    authors: [],
    science_guides: [],
});

export default function ThesisStep({
    participation,
    countries,
    degrees,
    titles,
    thesises,
    onBack,
    onAdd,
    onDelete,
}: {
    participation?: { id: number; confirmed: boolean } | null;
    countries: Array<Country>;
    degrees: Array<Degree>;
    titles: Array<Title>;
    thesises: Array<Thesis & { key: string }>;
    onBack: () => void;
    onAdd: (thesis: ThesisForm) => void;
    onDelete: (key: string) => void;
}) {
    const [deleteItem, setDeleteItem] = useState<DraftDocumentItem | null>(null);
    const [leaveOpen, setLeaveOpen] = useState(false);
    const [data, setData] = useState<ThesisForm>(emptyThesis);

    const textLength = getPlainTextLength(data.text);
    const literatureLength = getPlainTextLength(data.literature);
    const isTopicValid = data.topic.trim().length > 0 && data.topic.length <= 2000;
    const isTextValid = textLength > 0 && textLength <= 23000;
    const isLiteratureValid = literatureLength > 0 && literatureLength <= 23000;
    const canAddThesis = isTopicValid && isTextValid && isLiteratureValid && data.authors.length > 0;
    const isDirty =
        data.topic.length > 0 ||
        data.text.length > 0 ||
        data.literature.length > 0 ||
        data.authors.length > 0 ||
        data.science_guides.length > 0;

    function getMissingFieldsMessage(): string {
        const missing: string[] = [];
        if (!isTopicValid) {
            missing.push('тему тезисов');
        }
        if (!isTextValid) {
            missing.push('полный текст');
        }
        if (!isLiteratureValid) {
            missing.push('библиографический список');
        }
        if (data.authors.length === 0) {
            missing.push('добавить хотя бы одного автора');
        }

        return missing.length > 0 ? `Для добавления тезиса необходимо заполнить: ${missing.join(', ')}` : '';
    }

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        if (!canAddThesis) {
            return;
        }
        onAdd(data);
        setData(emptyThesis());
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

            <h1 className="mt-4 text-2xl font-semibold">Добавить тезис</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                После добавления тезис попадёт в заявку. Чтобы изменить документ, удалите его и добавьте заново.
            </p>

            <div className="mt-6">
                <h2 className="mb-2 text-base font-semibold">Уже в заявке</h2>
                <DraftDocumentList
                    items={thesises}
                    canDelete
                    onDelete={(item) => setDeleteItem(item)}
                />
            </div>

            <div className="mt-8 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                <p>
                    Полный текст должен быть представлен на одном из языков конференции: русском или английском.
                    Для работ, посвященных оригинальным исследованиям, текст должен быть структурирован по разделам:
                    «Актуальность», «Цель исследования», «Материалы и методы», «Результаты», «Выводы».
                </p>
                <p className="mt-3">
                    Объем текста тезиса должен быть не менее 6 500 и не более 23 000 символов с пробелом.
                    Цитаты сопровождаются ссылками на опубликованные источники в виде нумерации в квадратных скобках.
                    Рисунки и таблицы не принимаются.
                </p>
                <p className="mt-3">
                    Количество ссылок должно быть не менее 3, но не более 20. Вставляемый перечень ссылок не нужно
                    обозначать заголовком — вставляйте только ссылки.
                </p>
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
                    <Label htmlFor="topic">
                        Тема тезисов <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="topic"
                        maxLength={2000}
                        value={data.topic}
                        required
                        onChange={(event) => setData((current) => ({ ...current, topic: event.target.value }))}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="text">
                        Полный текст {textLength} / 23000 <span className="text-red-500">*</span>
                    </Label>
                    <RichTextEditor
                        id="text"
                        value={data.text}
                        height={300}
                        onChange={(value) => setData((current) => ({ ...current, text: value }))}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="literature">
                        Библиографический список {literatureLength} / 23000 <span className="text-red-500">*</span>
                    </Label>
                    <RichTextEditor
                        id="literature"
                        value={data.literature}
                        height={300}
                        onChange={(value) => setData((current) => ({ ...current, literature: value }))}
                    />
                </div>
                <div className="space-y-2">
                    <Button type="submit" disabled={!canAddThesis}>
                        Добавить в заявку
                    </Button>
                    {!canAddThesis && (
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
                title="Удалить тезис из заявки?"
                description={
                    participation
                        ? 'Этот тезис будет удалён из текущей версии заявки. Сохранённая заявка не изменится, пока вы не закончите подачу.'
                        : 'Этот тезис будет удалён из заявки.'
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
