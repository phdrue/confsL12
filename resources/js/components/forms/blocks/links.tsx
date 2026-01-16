import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, BadgeCheck, CircleX, Trash2, ChevronUp, ChevronDown } from "lucide-react"

export default function LinksTextBlockFormComponent({
    content,
    setData,
    errors
}: {
    content: any,
    setData: any,
    errors: any
}) {
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');

    const [showForm, setShowForm] = useState(false);

    function remove(index: number): void {
        const newContent = content.filter((_: any, i: number) => i !== index);
        setData('content', newContent);
    }

    function moveUp(index: number): void {
        if (index === 0) return;
        const newContent = [...content];
        [newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]];
        setData('content', newContent);
    }

    function moveDown(index: number): void {
        if (index === content.length - 1) return;
        const newContent = [...content];
        [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
        setData('content', newContent);
    }

    function hideAndResetForm(): void {
        setShowForm(false)
        setText('')
        setUrl('')
    }

    function addToContent(): void {
        setData('content', [...(content || []), { text, url }]);
        hideAndResetForm();
    }

    function getMissingFieldsMessage(): string {
        const missing: string[] = [];
        if (!text) missing.push('текст');
        if (!url) missing.push('ссылку');
        return missing.length > 0 ? `Для добавления необходимо заполнить: ${missing.join(', ')}` : '';
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">Содержимое поля ссылок</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                    {(content.length > 0) &&
                        <div className="space-y-1">
                            {content.map((item: {
                                text: string
                                url: string
                            }, index: number) => (
                                <div className="flex gap-2 items-center justify-between" key={`link-${index}-${item.text}-${item.url}`}>
                                    <p className="break-all">{item.text} - {item.url}</p>
                                    <div className="flex gap-1 shrink-0">
                                        <Button
                                            onClick={() => moveUp(index)}
                                            type="button"
                                            className="hover:text-blue-600"
                                            variant={"outline"}
                                            size={"iconSmall"}
                                            disabled={index === 0}>
                                            <ChevronUp />
                                        </Button>
                                        <Button
                                            onClick={() => moveDown(index)}
                                            type="button"
                                            className="hover:text-blue-600"
                                            variant={"outline"}
                                            size={"iconSmall"}
                                            disabled={index === content.length - 1}>
                                            <ChevronDown />
                                        </Button>
                                        <Button
                                            onClick={() => remove(index)}
                                            type="button"
                                            className="hover:text-red-600"
                                            variant={"outline"}
                                            size={"iconSmall"}>
                                            <Trash2 />
                                        </Button>
                                    </div>
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
                            Добавить
                        </Button> :
                            <div className="space-y-4">
                                <Button
                                    onClick={hideAndResetForm}
                                    type="button"
                                    variant={"outline"}>
                                    <CircleX className="h-4 w-4" />
                                    Отмена
                                </Button>
                                <div className="grid gap-2">
                                    <Label htmlFor="text">Текст</Label>
                                    <Input
                                        id="text"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                    <InputError message={errors.text} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="url">Ссылка</Label>
                                    <Input
                                        id="url"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                    <InputError message={errors.url} />
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        className="text-sm"
                                        onClick={addToContent}
                                        type="button"
                                        variant={"outline"}
                                        disabled={!text || !url}
                                    >
                                        Добавить
                                    </Button>
                                    {(!text || !url) && (
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
        </Card>
    )
}

