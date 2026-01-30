import { CircleX, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Conference } from '@/types/conferences';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea"
import AuthorsFormPartial from './authors';
import ScienceGuidesFormPartial from './science-guides';
import { Country, Degree, ScienceGuide, Thesis, Title } from '@/types/other';
import { Label } from '@/components/ui/label';

export default function ThesisParticipationForm({
    thesises,
    errors,
    setData,
    conference,
    countries,
    degrees,
    titles
}: {
    thesises: Array<Thesis>,
    errors: any,
    setData: any,
    conference: Conference,
    countries: Array<Country>,
    degrees: Array<Degree>,
    titles: Array<Title>
}) {
    const [topic, setTopic] = useState('');
    const [text, setText] = useState('');
    const [literature, setLiterature] = useState('');
    const [authors, setAuthors] = useState([]);
    const [scienceGuides, setScienceGuides] = useState<Array<ScienceGuide>>([]);

    const [showForm, setShowForm] = useState(false);

    function hideAndResetForm(): void {
        setShowForm(false)
        setTopic('')
        setText('')
        setLiterature('')
        setAuthors([])
        setScienceGuides([])
    }

    function addToContent(): void {
        setData('thesises', [...thesises, { topic, text, literature, authors, science_guides: scienceGuides }]);
        hideAndResetForm();
    }

    function remove(itemRemove: Thesis): void {
        const newContent = thesises.filter((item: Thesis, index: number) => index !== thesises.indexOf(itemRemove))
        setData('thesises', newContent);
    }

    function getMissingFieldsMessage(): string {
        const missing: string[] = [];
        if (!topic) missing.push('тему тезисов');
        if (!text) missing.push('полный текст');
        if (!literature) missing.push('библиографический список');
        if (authors.length === 0) missing.push('добавить хотя бы одного автора');
        return missing.length > 0 ? `Для добавления тезисов необходимо заполнить: ${missing.join(', ')}` : '';
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">Приложенные тезисы</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                    {(thesises.length > 0) &&
                        <div className="space-y-1">
                            {thesises.map((thesis, index) => (
                                <div className="flex gap-2 items-center justify-between" key={index}>
                                    <p className="break-all">{thesis.topic}</p>

                                    <Button
                                        onClick={() => remove(thesis)}
                                        type="button"
                                        className="shrink-0 hover:text-red-600"
                                        variant={"outline"}>
                                        <Trash2 className="h-4 w-4" />
                                        Удалить
                                    </Button>
                                </div>
                            ))}
                        </div>
                    }
                    <div>
                        {!showForm ? <Button
                            onClick={() => setShowForm(true)}
                            type="button"
                            variant={"outline"}>
                            <Plus className="h-4 w-4" />
                            Добавить тезисы
                        </Button> :
                            <div className="space-y-4">
                                <Button
                                    onClick={hideAndResetForm}
                                    type="button"
                                    variant={"outline"}>
                                    <CircleX className="h-4 w-4" />
                                    Отмена
                                </Button>
                                <div className="grid gap-6">
                                    <div>
                                        <AuthorsFormPartial countries={countries} setData={setAuthors} authors={authors} errors={errors} />
                                        <InputError message={errors.authors} className="mt-2" />
                                    </div>
                                    <div>
                                        <ScienceGuidesFormPartial scienceGuides={scienceGuides} setData={setScienceGuides} error={errors.science_guides} countries={countries} degrees={degrees} titles={titles} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="topic">Тема тезисов <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="topic"
                                            maxLength={2000}
                                            name="topic"
                                            value={topic}
                                            className="w-full"
                                            autoComplete="topic"
                                            required
                                            onChange={(e) => setTopic(e.target.value)}
                                        />
                                        <InputError message={errors.topic} className="mt-2" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="text">Полный текст {text.length} / 23000 <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="text"
                                            maxLength={23000}
                                            name="text"
                                            value={text}
                                            className="w-full"
                                            autoComplete="text"
                                            required
                                            placeholder="Полный текст должен быть представлен на ОДНОМ ИЗ ЯЗЫКОВ КОНФЕРЕНЦИИ: русском или английском. Для работ, посвященных оригинальным исследованиям, текст должен быть структурирован по разделам: «Актуальность», «Цель исследования» «Материалы и методы», «Результаты», «Выводы». Объем текста тезиса должен быть не менее 6 500 и не более 23 000 символов с пробелом (эквивалентно 2-7 страницам текста, набранного шрифтом Times New Roman, 14, с одинарным межстрочным интервалом). Просьба не вставлять в текст работы дополнительных пробелов, абзацных отступов (особенно сформированных пробелами), межстрочных интервалов. Цитаты сопровождаются ссылками на опубликованные источники в виде нумерации в квадратных скобках. Рисунки и таблицы не принимаются."
                                            onChange={(e) => setText(e.target.value)}
                                        />
                                        <InputError message={errors.text} className="mt-2" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="literature">Библиографический список {literature.length} / 23000 <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="literature"
                                            maxLength={23000}
                                            name="literature"
                                            value={literature}
                                            className="w-full"
                                            autoComplete="literature"
                                            required
                                            placeholder="Количество ссылок должно быть не менее 3, но не более 20. Вставляемый перечень ссылок просьба НЕ ОБОЗНАЧАТЬ заголовком типа 'Список литературы', 'Литература' и тому подобным - вставлять необходимо только ссылки."
                                            onChange={(e) => setLiterature(e.target.value)}
                                        />
                                        <InputError message={errors.literature} className="mt-2" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        className="text-sm"
                                        onClick={addToContent}
                                        type="button"
                                        variant={"outline"}
                                        disabled={!topic || !text || !literature || authors.length === 0}
                                    >
                                        Добавить
                                    </Button>
                                    {(!topic || !text || !literature || authors.length === 0) && (
                                        <p className="text-sm text-muted-foreground">
                                            {getMissingFieldsMessage()}
                                        </p>
                                    )}
                                </div>
                            </div>}
                        <InputError message={errors.content} className="mt-2" />
                        <InputError message={errors["content.items"]} className="mt-2" />
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}
