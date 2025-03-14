import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, BadgeCheck, CircleX, Trash2 } from "lucide-react"

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

    function remove(itemRemove: { text: string; url: string }): void {
        const newContent = content
        newContent.items = newContent.items.filter((item: { text: string; url: string }, index: number) => index !== newContent.items.indexOf(itemRemove))
        setData('content', newContent);
    }

    function hideAndResetForm(): void {
        setShowForm(false)
        setText('')
        setUrl('')
    }

    function addToContent(): void {
        if (content.length === 0) {
            setData('content', [{ text, url }]);
        } else {
            setData('content', [...content, { text, url }]);
        }
        hideAndResetForm();
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
                            }) => (
                                <div className="flex gap-2 items-center justify-between" key={item.text}>
                                    <p className="break-all">{item.text} - {item.url}</p>
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
                                {(text && url) &&
                                    <Button
                                        className="text-sm"
                                        onClick={addToContent}
                                        type="button"
                                        variant={"outline"}
                                    // size={"iconSmall"}
                                    >
                                        <BadgeCheck className="text-emerald-600" /> Добавить
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

