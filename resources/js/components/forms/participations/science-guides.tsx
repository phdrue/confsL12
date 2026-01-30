import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InputError from "@/components/input-error"
import { CircleX, Plus, Trash2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Country, Degree, ScienceGuide, Title } from "@/types/other"

export default function ScienceGuidesFormPartial({
    scienceGuides,
    setData,
    error,
    countries,
    degrees,
    titles,
}: {
    scienceGuides: Array<ScienceGuide>,
    setData: (value: Array<ScienceGuide>) => void,
    error?: string,
    countries: Array<Country>,
    degrees: Array<Degree>,
    titles: Array<Title>
}) {
    const [name, setName] = useState('')
    const [degree, setDegree] = useState('')
    const [title, setTitle] = useState('')
    const [city, setCity] = useState('')
    const [countryId, setCountryId] = useState('')
    const [organization, setOrganization] = useState('')
    const [showForm, setShowForm] = useState(false)

    function remove(guideToDelete: ScienceGuide): void {
        const newGuides = scienceGuides.filter((guide: ScienceGuide, index: number) => index !== scienceGuides.indexOf(guideToDelete))
        setData(newGuides)
    }

    function hideAndResetForm(): void {
        setShowForm(false)
        setName('')
        setDegree('')
        setTitle('')
        setCity('')
        setCountryId('')
        setOrganization('')
    }

    function addGuide(): void {
        setData([...scienceGuides, { name, degree, title, city, country_id: countryId, organization }])
        hideAndResetForm()
    }

    function getMissingFieldsMessage(): string {
        const missing: string[] = [];
        if (!name) missing.push('ФИО');
        if (!degree) missing.push('ученую степень');
        if (!title) missing.push('ученое звание');
        if (!city) missing.push('город');
        if (!countryId) missing.push('страну');
        if (!organization) missing.push('организацию');
        return missing.length > 0 ? `Для добавления научного руководителя необходимо заполнить: ${missing.join(', ')}` : '';
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
                                    <p className="break-all">
                                        {`${guide.name} (${guide.degree}, ${guide.title}): ${guide.organization}, ${guide.city}, ${countries.find((country) => country.id === Number(guide.country_id))?.name}`}
                                    </p>
                                    <Button
                                        onClick={() => remove(guide)}
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
                            Добавить руководителя
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
                                    <div className="grid gap-2">
                                        <Label htmlFor="science-guide-name">ФИО научного руководителя (Полностью) <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="science-guide-name"
                                            type="text"
                                            required
                                            value={name}
                                            placeholder="Иванов Иван Иванович"
                                            onChange={(event) => setName(event.target.value)}
                                        />
                                        <InputError message={error} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="science-guide-degree">Ученая степень <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="science-guide-degree"
                                            type="text"
                                            required
                                            value={degree}
                                            placeholder="доктор наук, кандидат наук"
                                            onChange={(event) => setDegree(event.target.value)}
                                        />
                                        <InputError message={error} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="science-guide-title">Ученое звание <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="science-guide-title"
                                            type="text"
                                            required
                                            value={title}
                                            placeholder="профессор, доцент"
                                            onChange={(event) => setTitle(event.target.value)}
                                        />
                                        <InputError message={error} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="science-guide-city">Город <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="science-guide-city"
                                            type="text"
                                            required
                                            value={city}
                                            onChange={(event) => setCity(event.target.value)}
                                        />
                                        <InputError message={error} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="science-guide-country_id">Страна <span className="text-red-500">*</span></Label>
                                        <Select name="science-guide-country_id" value={countryId} onValueChange={(country_id) => setCountryId(country_id)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Выберите страну" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Страны</SelectLabel>
                                                    {countries.map((country) => (
                                                        <SelectItem key={country.id} value={String(country.id)}>{country.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={error} className="mt-2" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="science-guide-organization">Организация <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="science-guide-organization"
                                            type="text"
                                            required
                                            value={organization}
                                            onChange={(event) => setOrganization(event.target.value)}
                                        />
                                        <InputError message={error} />
                                    </div>
                                    <div className="space-y-2">
                                        <Button
                                            className="text-sm"
                                            onClick={addGuide}
                                            type="button"
                                            variant={"outline"}
                                            disabled={!name || !degree || !title || !city || !countryId || !organization}
                                        >
                                            Добавить руководителя
                                        </Button>
                                        {(!name || !degree || !title || !city || !countryId || !organization) && (
                                            <p className="text-sm text-muted-foreground">
                                                {getMissingFieldsMessage()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>}
                        <InputError message={error} className="mt-2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
