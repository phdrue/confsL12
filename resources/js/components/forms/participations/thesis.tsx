import { Head, useForm } from '@inertiajs/react';
import { CircleX, LoaderCircle, Plus, Trash2, WandSparkles } from 'lucide-react';
import { FormEventHandler, useState, ChangeEvent } from 'react';
import { Author, Conference, ConferenceType, ReportType } from '@/types/conferences';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import AuthorsFormPartial from './authors';
import { Country, Thesis } from '@/types/other';

export default function ThesisParticipationForm({
    thesises,
    errors,
    setData,
    conference,
    countries
}: {
    thesises: Array<Thesis>,
    errors: any,
    setData: any,
    conference: Conference,
    countries: Array<Country>
}) {
    const [topic, setTopic] = useState('');
    const [text, setText] = useState('');
    const [literature, setLiterature] = useState('');
    const [authors, setAuthors] = useState([]);

    const [showForm, setShowForm] = useState(false);

    function hideAndResetForm(): void {
        setShowForm(false)
        setTopic('')
        setText('')
        setLiterature('')
        setAuthors([])
    }

    function addToContent(): void {
        setData('thesises', [...thesises, { topic, text, literature, authors }]);
        hideAndResetForm();
    }

    function remove(itemRemove: Thesis): void {
        const newContent = thesises.filter((item: Thesis, index: number) => index !== thesises.indexOf(itemRemove))
        setData('thesises', newContent);
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
                                        variant={"outline"}
                                        size={"iconSmall"}>
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    }
                    <div>
                        {!showForm ? <Button
                            onClick={() => setShowForm(true)}
                            type="button"
                            variant={"outline"}
                            size={"iconSmall"}>
                            <Plus />
                        </Button> :
                            <div className="space-y-4">
                                <Button
                                    onClick={hideAndResetForm}
                                    type="button"
                                    variant={"outline"}
                                    size={"iconSmall"}>
                                    <CircleX />
                                </Button>
                                <div className="grid gap-6">
                                    <div>
                                        <AuthorsFormPartial countries={countries} setData={setAuthors} authors={authors} errors={errors} />
                                        <InputError message={errors.authors} className="mt-2" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="topic">Тема тезисов</Label>
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
                                        <Label htmlFor="text">Полный текст {text.length} / 23000</Label>
                                        <Textarea
                                            id="text"
                                            maxLength={23000}
                                            name="text"
                                            value={text}
                                            className="w-full"
                                            autoComplete="text"
                                            required
                                            onChange={(e) => setText(e.target.value)}
                                        />
                                        <InputError message={errors.text} className="mt-2" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="literature">Список литературы {literature.length} / 23000</Label>
                                        <Textarea
                                            id="literature"
                                            maxLength={23000}
                                            name="literature"
                                            value={literature}
                                            className="w-full"
                                            autoComplete="literature"
                                            required
                                            onChange={(e) => setLiterature(e.target.value)}
                                        />
                                        <InputError message={errors.literature} className="mt-2" />
                                    </div>
                                </div>
                                {(topic && text && literature && authors.length > 0) &&
                                    <Button
                                        className="text-sm"
                                        onClick={addToContent}
                                        type="button"
                                        variant={"outline"}
                                    >
                                        Добавить
                                    </Button>
                                }
                            </div>}
                        <InputError message={errors.content} className="mt-2" />
                        <InputError message={errors["content.items"]} className="mt-2" />
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}
