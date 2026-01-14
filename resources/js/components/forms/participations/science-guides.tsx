import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InputError from "@/components/input-error"
import { CircleX, Plus, Trash2 } from "lucide-react"

export default function ScienceGuidesFormPartial({
    scienceGuides,
    setData,
    error,
}: {
    scienceGuides: Array<string>,
    setData: (value: Array<string>) => void,
    error?: string
}) {
    const [value, setValue] = useState('')
    const [showForm, setShowForm] = useState(false)

    function remove(indexToDelete: number): void {
        const updated = scienceGuides.filter((_guide, index) => index !== indexToDelete)
        setData(updated)
    }

    function hideAndResetForm(): void {
        setShowForm(false)
        setValue('')
    }

    function addGuide(): void {
        if (!value.trim()) {
            return
        }

        setData([...scienceGuides, value.trim()])
        hideAndResetForm()
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">Научные руководители</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                    {(scienceGuides.length > 0) &&
                        <div className="space-y-1">
                            {scienceGuides.map((guide, index) => (
                                <div className="flex gap-2 items-center justify-between" key={index}>
                                    <p className="break-all">{guide}</p>
                                    <Button
                                        onClick={() => remove(index)}
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
                                    <Label htmlFor="science-guide">Научный руководитель (для обучающихся)</Label>
                                    <Input
                                        id="science-guide"
                                        type="text"
                                        value={value}
                                        required
                                        onChange={(event) => setValue(event.target.value)}
                                    />
                                </div>
                                {value.trim() &&
                                    <Button
                                        className="text-sm"
                                        onClick={addGuide}
                                        type="button"
                                        variant={"outline"}
                                    >
                                        Добавить руководителя
                                    </Button>
                                }
                            </div>}
                        <InputError message={error} className="mt-2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
