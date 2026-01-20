import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, BadgeCheck, CircleX, Trash2, ChevronUp, ChevronDown } from "lucide-react"

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
    const [items, setItems] = useState<Array<{ header: string, items: Array<string> }>>([]);
    const [item, setItem] = useState('');
    const [subItems, setSubItems] = useState<Array<string>>([]);
    const [subItem, setSubItem] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [showSubItemForm, setShowSubItemForm] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);

    function hideAndResetForm(): void {
        setShowForm(false);
        setShowItemForm(false);
        setShowSubItemForm(false);
        setHeader('');
        setItems([]);
        setItem('');
        setSubItems([]);
        setSubItem('');
        setCurrentItemIndex(null);
    }

    function addToContent(): void {
        setData('content', [...(content || []), { header, items }]);
        hideAndResetForm()
    }

    function getMissingFieldsMessage(): string {
        const missing: string[] = [];
        if (!header) missing.push('заголовок');
        return missing.length > 0 ? `Для добавления необходимо заполнить: ${missing.join(', ')}` : '';
    }

    function addToItems(): void {
        setItems([...items, { header: item, items: subItems }]);
        setItem('');
        setSubItems([]);
        setSubItem('');
        setShowItemForm(false);
        setShowSubItemForm(false);
    }

    function addToSubItems(): void {
        setSubItems([...subItems, subItem]);
        setSubItem('');
        setShowSubItemForm(false);
    }

    function removeSubItem(subItemIndex: number): void {
        const newSubItems = subItems.filter((_: string, i: number) => i !== subItemIndex);
        setSubItems(newSubItems);
    }

    function removeItemFromList(itemIndex: number): void {
        const newItems = items.filter((_: any, i: number) => i !== itemIndex);
        setItems(newItems);
    }

    function removeItem(index: number): void {
        const currentContent = content || [];
        const newContent = currentContent.filter((_: any, i: number) => i !== index);
        setData('content', newContent);
    }

    function moveUp(index: number): void {
        if (index === 0) return;
        const currentContent = content || [];
        const newContent = [...currentContent];
        [newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]];
        setData('content', newContent);
    }

    function moveDown(index: number): void {
        const currentContent = content || [];
        if (index === currentContent.length - 1) return;
        const newContent = [...currentContent];
        [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
        setData('content', newContent);
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">Содержимое поля списка</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                    {(content && content.length > 0) &&
                        <div className="space-y-1">
                            {content.map((item: {
                                header: string
                                items: Array<{ header: string, items: Array<string> }>
                            }, index: number) => (
                                <div className="flex gap-2 items-center justify-between" key={`list-${index}-${item.header}`}>
                                    <div>
                                        <p className="break-all">{item.header}</p>
                                        {
                                            (item.items.length > 0) &&
                                            <div className="space-y-1 pl-4">
                                                {item.items.map((subitem: { header: string, items: Array<string> }, subIndex: number) => (
                                                    <div key={`subitem-${index}-${subIndex}`}>
                                                        <p className="break-all">{subitem.header}</p>
                                                        {
                                                            (subitem.items.length > 0) &&
                                                            <div className="space-y-1 pl-4">
                                                                {subitem.items.map((nestedItem: string, nestedIndex: number) => (
                                                                    <p className="break-all" key={`nesteditem-${index}-${subIndex}-${nestedIndex}`}>{nestedItem}</p>
                                                                ))}
                                                            </div>
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        }
                                    </div>
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
                                            onClick={() => removeItem(index)}
                                            type="button"
                                            className="shrink-0 hover:text-red-600"
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
                                        (items.length > 0) && items.map((itemObj: { header: string, items: Array<string> }, index) => (
                                            <div className="space-y-2 pl-4 border-l-2 border-gray-200" key={index}>
                                                <div className="flex gap-2 items-center">
                                                    <p className="break-all flex-1">{itemObj.header}</p>
                                                    <Button
                                                        onClick={() => removeItemFromList(index)}
                                                        type="button"
                                                        className="shrink-0 hover:text-red-600"
                                                        variant={"outline"}
                                                        size={"iconSmall"}>
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                                {
                                                    (itemObj.items.length > 0) &&
                                                    <div className="space-y-1 pl-4">
                                                        {itemObj.items.map((subItem: string, subIndex: number) => (
                                                            <div className="flex gap-2 items-center" key={subIndex}>
                                                                <p className="break-all flex-1">{subItem}</p>
                                                                <Button
                                                                    onClick={() => {
                                                                        const newItems = items.map((item, idx) => 
                                                                            idx === index 
                                                                                ? { ...item, items: item.items.filter((_: string, i: number) => i !== subIndex) }
                                                                                : item
                                                                        );
                                                                        setItems(newItems);
                                                                    }}
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
                                                <div className="space-y-2">
                                                    {!showSubItemForm || currentItemIndex !== index ? (
                                                        <Button
                                                            onClick={() => {
                                                                setSubItem('');
                                                                setCurrentItemIndex(index);
                                                                setShowSubItemForm(true);
                                                            }}
                                                            type="button"
                                                            variant={"outline"}>
                                                            <Plus className="h-3 w-3" />
                                                            Добавить подпункт
                                                        </Button>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <div className="grid gap-2">
                                                                <Label htmlFor={`subItem-${index}`}>Подпункт</Label>
                                                                <div className="flex gap-2">
                                                                    <Input
                                                                        id={`subItem-${index}`}
                                                                        type="text"
                                                                        required
                                                                        value={subItem}
                                                                        onChange={(e) => setSubItem(e.target.value)}
                                                                        className="flex-1"
                                                                    />
                                                                    <Button
                                                                        onClick={() => {
                                                                            const newItems = items.map((item, idx) => 
                                                                                idx === index 
                                                                                    ? { ...item, items: [...item.items, subItem] }
                                                                                    : item
                                                                            );
                                                                            setItems(newItems);
                                                                            setSubItem('');
                                                                            setShowSubItemForm(false);
                                                                            setCurrentItemIndex(null);
                                                                        }}
                                                                        type="button"
                                                                        variant={"outline"}
                                                                        disabled={!subItem}
                                                                    >
                                                                        <Plus /> Добавить
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => {
                                                                            setSubItem('');
                                                                            setShowSubItemForm(false);
                                                                            setCurrentItemIndex(null);
                                                                        }}
                                                                        type="button"
                                                                        variant={"outline"}
                                                                    >
                                                                        <CircleX className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                {
                                    !showItemForm ? <Button
                                        onClick={() => setShowItemForm(true)}
                                        type="button"
                                        variant={"outline"}>
                                        <Plus /> Добавить подзаголовок
                                    </Button> :
                                        <fieldset className="space-y-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="item">Подзаголовок</Label>
                                                <Input
                                                    id="item"
                                                    type="text"
                                                    required
                                                    tabIndex={1}
                                                    value={item}
                                                    onChange={(e) => setItem(e.target.value)}
                                                />
                                                <InputError message={errors.key} />
                                            </div>
                                            <div className="space-y-2">
                                                <p>Подпункты:</p>
                                                {
                                                    (subItems.length > 0) && (
                                                        <div className="space-y-1 pl-4 border-l-2 border-gray-200">
                                                            {subItems.map((subItemText: string, index) => (
                                                                <div className="flex gap-2 items-center" key={index}>
                                                                    <p className="break-all flex-1">{subItemText}</p>
                                                                    <Button
                                                                        onClick={() => removeSubItem(index)}
                                                                        type="button"
                                                                        className="shrink-0 hover:text-red-600"
                                                                        variant={"outline"}
                                                                        size={"iconSmall"}>
                                                                        <Trash2 />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                                <div className="space-y-2">
                                                    {!showSubItemForm ? (
                                                        <Button
                                                            onClick={() => {
                                                                setSubItem('');
                                                                setCurrentItemIndex(null);
                                                                setShowSubItemForm(true);
                                                            }}
                                                            type="button"
                                                            variant={"outline"}>
                                                            <Plus className="h-3 w-3" />
                                                            Добавить подпункт
                                                        </Button>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="subItem">Подпункт</Label>
                                                                <div className="flex gap-2">
                                                                    <Input
                                                                        id="subItem"
                                                                        type="text"
                                                                        required
                                                                        value={subItem}
                                                                        onChange={(e) => setSubItem(e.target.value)}
                                                                        className="flex-1"
                                                                    />
                                                                    <Button
                                                                        onClick={addToSubItems}
                                                                        type="button"
                                                                        variant={"outline"}
                                                                        disabled={!subItem}
                                                                    >
                                                                        <Plus /> Добавить
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => {
                                                                            setSubItem('');
                                                                            setShowSubItemForm(false);
                                                                            setCurrentItemIndex(null);
                                                                        }}
                                                                        type="button"
                                                                        variant={"outline"}
                                                                    >
                                                                        <CircleX className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {item && <Button
                                                className="w-max"
                                                onClick={addToItems}
                                                type="button"
                                                variant={"outline"}
                                            >
                                                <Plus /> Добавить подзаголовок
                                            </Button>}
                                        </fieldset>
                                }
                                <div className="space-y-2">
                                    <Button
                                        className="text-sm block"
                                        onClick={addToContent}
                                        type="button"
                                        variant={"outline"}
                                        disabled={!header}
                                    >
                                        Добавить элемент
                                    </Button>
                                    {!header && (
                                        <p className="text-sm text-muted-foreground">
                                            {getMissingFieldsMessage()}
                                        </p>
                                    )}
                                </div>
                            </div>}
                        <InputError message={errors.content} className="mt-2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}