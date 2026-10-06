import ConsentDialog from '@/components/forms/participations/consent-dialog';
import DraftDocumentList, { DraftDocumentItem } from '@/components/forms/participations/draft-document-list';
import AuthorsFormPartial from '@/components/forms/participations/authors';
import ScienceGuidesFormPartial from '@/components/forms/participations/science-guides';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor, { getPlainTextLength } from '@/components/rich-text-editor';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import ParticipationWizardLayout from './layout';
import { ParticipationWizardPageProps } from './types';

export default function ParticipationThesisPage({
    conference,
    draft,
    countries,
    degrees,
    titles,
}: ParticipationWizardPageProps) {
    const [deleteItem, setDeleteItem] = useState<DraftDocumentItem | null>(null);
    const [leaveOpen, setLeaveOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        topic: '',
        text: '',
        literature: '',
        authors: [] as Array<never>,
        science_guides: [] as Array<never>,
    });

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

    const goBack = () => router.visit(route('client.conferences.participation', conference.id));

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('client.conferences.participation.thesis.store', conference.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <ParticipationWizardLayout conference={conference} title="Добавить тезис">
            <button
                type="button"
                className="text-sm text-muted-foreground underline-offset-2 hover:underline"
                onClick={() => (isDirty ? setLeaveOpen(true) : goBack())}
            >
                Назад
            </button>

            <h1 className="mt-4 text-2xl font-semibold">Добавить тезис</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                После добавления тезис попадёт в черновик. Чтобы изменить документ, удалите его и добавьте заново.
            </p>

            <div className="mt-6">
                <h2 className="mb-2 text-base font-semibold">Уже в черновике</h2>
                <DraftDocumentList
                    items={draft.thesises}
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
                    <Label htmlFor="topic">Тема тезисов <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="topic"
                        maxLength={2000}
                        value={data.topic}
                        required
                        onChange={(event) => setData('topic', event.target.value)}
                    />
                    <InputError message={errors.topic} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="text">Полный текст {textLength} / 23000 <span className="text-red-500">*</span></Label>
                    <RichTextEditor id="text" value={data.text} height={300} onChange={(value) => setData('text', value)} />
                    <InputError message={errors.text} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="literature">Библиографический список {literatureLength} / 23000 <span className="text-red-500">*</span></Label>
                    <RichTextEditor id="literature" value={data.literature} height={300} onChange={(value) => setData('literature', value)} />
                    <InputError message={errors.literature} />
                </div>
                <InputError message={errors.authorization} />
                <div className="space-y-2">
                    <Button type="submit" disabled={processing || !canAddThesis}>
                        Добавить в черновик
                    </Button>
                    {!canAddThesis && (
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
                title="Удалить тезис из черновика?"
                description="Этот тезис будет удалён только из черновика. Сохранённая заявка не изменится, пока вы не закончите подачу."
                confirmLabel="Удалить"
                confirmVariant="destructive"
                onConfirm={() => {
                    if (!deleteItem) {
                        return;
                    }
                    router.delete(route('client.conferences.participation.thesis.destroy', {
                        conference: conference.id,
                        item: deleteItem.key,
                    }));
                }}
            />
            <ConsentDialog
                open={leaveOpen}
                onOpenChange={setLeaveOpen}
                title="Покинуть форму?"
                description="Введённые данные не будут сохранены в черновик."
                confirmLabel="Покинуть"
                confirmVariant="destructive"
                onConfirm={goBack}
            />
        </ParticipationWizardLayout>
    );
}
