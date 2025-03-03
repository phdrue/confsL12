import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import Checkbox from "@/Components/Checkbox"
import { Button } from "@/Components/ui/button"
import { Plus, BadgeCheck, CircleX, Trash2 } from "lucide-react"

export default function KeyValueTextBlockFormComponent({ content, setData, errors }: { content: any, setData: any, errors: any }) {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');

    const [showForm, setShowForm] = useState(false);

    function remove(itemRemove: { key: string; value: string }): void {
        const newContent = content
        newContent.items = newContent.items.filter((item: { key: string; value: string }, index: number) => index !== newContent.items.indexOf(itemRemove))
        setData('content', newContent);
    }

    function handleTableDisplayChange(e: React.ChangeEvent<HTMLInputElement>) {
        // const newContent = content
        // newContent.tableDisplay = e.target.checked
        // setData('content', newContent)
        setData('content', { ...content, tableDisplay: e.target.checked })
    }

    function handleColorDisplayChange(e: React.ChangeEvent<HTMLInputElement>) {
        // const newContent = content
        // newContent.tableDisplay = e.target.checked
        // setData('content', newContent)
        setData('content', { ...content, colorDisplay: e.target.checked })
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
        setKey('');
        setValue('');
        setShowForm(false);
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">Содержимое поля ключ-значение</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={content.tableDisplay}
                            onChange={handleTableDisplayChange}
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Табличный вариант
                        </span>
                    </label>

                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={content.colorDisplay}
                            onChange={handleColorDisplayChange}
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Цветной вариант
                        </span>
                    </label>

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
                                <fieldset className="space-y-2">
                                    <InputLabel htmlFor="key" value="Ключ" />
                                    <TextInput
                                        id="key"
                                        required
                                        name="key"
                                        value={key}
                                        className="w-full"
                                        autoComplete="key"
                                        isFocused={true}
                                        onChange={(e) => setKey(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset className="space-y-2">
                                    <InputLabel htmlFor="value" value="Значение" />
                                    <TextInput
                                        id="value"
                                        required
                                        name="value"
                                        value={value}
                                        className="w-full"
                                        autoComplete="value"
                                        isFocused={true}
                                        onChange={(e) => setValue(e.target.value)}
                                    />
                                </fieldset>
                                {(key && value) &&
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

