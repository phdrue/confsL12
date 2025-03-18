import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, BadgeCheck, CircleX, Trash2 } from "lucide-react"

export default function ListTextBlockFormComponent({
    content,
    setData,
    errors
}: {
    content: any,
    setData: any,
    errors: any
}) {
    const [header, setHeader] = useState('');
    const [items, setItems] = useState<Array<string>>([]);
    const [item, setItem] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);

    function hideAndResetForm(): void {
        setShowForm(false);
        setShowItemForm(false);
        setHeader('');
        setItems([]);
        setItem('');
    }

    function addToContent(): void {
        if (content.length === 0) {
            setData('content', [{ header, items }]);
        } else {
            setData('content', [...content, { header, items }]);
        }
        hideAndResetForm()
    }

    function addToItems(): void {
        setItems([...items, item]);
        setItem('');
        setShowItemForm(false);
    }

    function removeItem(itemRemove: { header: string; items: Array<string> }): void {
        const newContent = content.filter((item: { header: string; items: Array<string> }, index: number) => index !== content.indexOf(itemRemove))
        setData('content', newContent);
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">Содержимое поля списка</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                    {(content.length > 0) &&
                        <div className="space-y-1">
                            {content.map((item: {
                                header: string
                                items: Array<string>
                            }, index: number) => (
                                <div className="flex gap-2 items-center justify-between" key={index}>
                                    <div>
                                        <p className="break-all">{item.header}</p>
                                        {
                                            (item.items.length > 0) &&
                                            <div className="space-y-1 pl-4">
                                                {item.items.map((subitem: string, index) => (
                                                    <p className="break-all" key={index}>{subitem}</p>
                                                ))}
                                            </div>
                                        }
                                    </div>
                                    <Button
                                        onClick={() => removeItem(item)}
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
                                    <Label htmlFor="key">Заголовок</Label>
                                    <Input
                                        id="text"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        value={header}
                                        onChange={(e) => setHeader(e.target.value)}
                                    />
                                    <InputError message={errors.key} />
                                </div>
                                <div className="space-y-2">
                                    <p>Подзаголовки:</p>
                                    {
                                        (items.length > 0) && items.map((item: string, index) => (
                                            <div className="flex gap-2 items-center" key={index}>
                                                <p className="break-all">{item}</p>
                                                {/* <Button
                                                        onClick={() => remove(item)}
                                                        type="button"
                                                        className="shrink-0 hover:text-red-600"
                                                        variant={"outline"}
                                                        size={"iconSmall"}>
                                                        <Trash2 />
                                                    </Button> */}
                                            </div>
                                        ))
                                    }
                                </div>
                                {
                                    !showItemForm ? <Button
                                        onClick={() => setShowItemForm(true)}
                                        type="button"
                                        variant={"outline"}
                                        size={"iconSmall"}>
                                        <Plus />
                                    </Button> :
                                        <fieldset className="space-y-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="item">Заголовок</Label>
                                                <Input
                                                    id="item"
                                                    type="text"
                                                    required
                                                    tabIndex={1}
                                                    value={item}
                                                    onChange={(e) => setItem(e.target.value)}
                                                />
                                                <InputError message={errors.key} />
                                                {item && <Button
                                                    className="w-max"
                                                    onClick={addToItems}
                                                    type="button"
                                                    variant={"outline"}
                                                >
                                                    <Plus /> Подзаголовок
                                                </Button>}
                                            </div>
                                        </fieldset>
                                }
                                {(header) &&
                                    <Button
                                        className="text-sm block"
                                        onClick={addToContent}
                                        type="button"
                                        variant={"outline"}
                                    // size={"iconSmall"}
                                    > Добавить элемент
                                    </Button>
                                }
                            </div>}
                        <InputError message={errors.content} className="mt-2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}