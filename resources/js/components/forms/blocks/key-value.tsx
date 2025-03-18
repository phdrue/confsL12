import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, BadgeCheck, CircleX, Trash2 } from "lucide-react"

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

    function remove(itemRemove: { key: string; value: string }): void {
        const newContent = content
        newContent.items = newContent.items.filter((item: { key: string; value: string }, index: number) => index !== newContent.items.indexOf(itemRemove))
        setData('content', newContent);
    }

    function hideAndResetForm(): void {
        setShowForm(false)
        setKey('')
        setValue('')
    }

    function addToContent(): void {
        if (content.items.length === 0) {
            const newContent = content
            newContent.items = [{ key, value }]
            setData('content', newContent);
        } else {
            const newContent = content
            newContent.items = [...content.items, { key, value }]
            setData('content', newContent);
        }
        hideAndResetForm()
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
                            }) => (
                                <div className="flex gap-2 items-center justify-between" key={item.value}>
                                    <p className="break-all">{item.key} - {item.value}</p>
                                    <Button
                                        onClick={() => remove(item)}
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
                                {(key && value) &&
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
        </Card>
    )
}

