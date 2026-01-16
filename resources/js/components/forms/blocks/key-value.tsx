import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, BadgeCheck, CircleX, Trash2, ChevronUp, ChevronDown } from "lucide-react"

export default function KeyValueTextBlockFormComponent({
    content,
    setData,
    errors
}: {
    content: any,
    setData: any,
    errors: any
}) {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');

    const [showForm, setShowForm] = useState(false);

    function remove(index: number): void {
        const newContent = { ...content };
        newContent.items = newContent.items.filter((_: any, i: number) => i !== index);
        setData('content', newContent);
    }

    function moveUp(index: number): void {
        if (index === 0) return;
        const newContent = { ...content };
        const items = [...newContent.items];
        [items[index - 1], items[index]] = [items[index], items[index - 1]];
        newContent.items = items;
        setData('content', newContent);
    }

    function moveDown(index: number): void {
        if (index === content.items.length - 1) return;
        const newContent = { ...content };
        const items = [...newContent.items];
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
        newContent.items = items;
        setData('content', newContent);
    }

    function hideAndResetForm(): void {
        setShowForm(false)
        setKey('')
        setValue('')
    }

    function addToContent(): void {
        const newContent = { ...content };
        newContent.items = [...(content.items || []), { key, value }];
        setData('content', newContent);
        hideAndResetForm()
    }

    function getMissingFieldsMessage(): string {
        const missing: string[] = [];
        if (!key) missing.push('ключ');
        if (!value) missing.push('значение');
        return missing.length > 0 ? `Для добавления необходимо заполнить: ${missing.join(', ')}` : '';
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">Содержимое поля ключ-значение</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <Checkbox id="table-display" checked={content.tableDisplay} onCheckedChange={(e) => setData('content', { ...content, tableDisplay: e === true })} name="table-display" tabIndex={3} />
                        <Label htmlFor="table-display">Табличный вариант</Label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox id="color-display" checked={content.colorDisplay} onCheckedChange={(e) => setData('content', { ...content, colorDisplay: e === true })} name="color-display" tabIndex={3} />
                        <Label htmlFor="color-display">Цветной вариант</Label>
                    </div>

                    {(content.items.length > 0) &&
                        <div className="space-y-1">
                            {content.items.map((item: {
                                key: string
                                value: string
                            }, index: number) => (
                                <div className="flex gap-2 items-center justify-between" key={`item-${index}-${item.key}-${item.value}`}>
                                    <p className="break-all">{item.key} - {item.value}</p>
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
                                            disabled={index === content.items.length - 1}>
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
                                    <Label htmlFor="key">Ключ</Label>
                                    <Input
                                        id="key"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                    />
                                    <InputError message={errors.key} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="value">Значение</Label>
                                    <Input
                                        id="value"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    />
                                    <InputError message={errors.value} />
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        className="text-sm"
                                        onClick={addToContent}
                                        type="button"
                                        variant={"outline"}
                                        disabled={!key || !value}
                                    >
                                        Добавить
                                    </Button>
                                    {(!key || !value) && (
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

