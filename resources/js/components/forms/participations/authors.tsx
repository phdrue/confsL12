import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import { Plus, BadgeCheck, CircleX, Trash2 } from "lucide-react"
import { Author } from "@/types/conferences";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Country } from "@/types/other";

export default function AuthorsFormPartial({
    authors,
    setData,
    errors,
    countries
}: {
    authors: Array<Author>,
    setData: any,
    errors: any,
    countries: Array<Country>
}) {
    const [name, setName] = useState('');
    const [organization, setOrganization] = useState('');
    const [city, setCity] = useState('');
    const [countryId, setCountryId] = useState('');

    const [showForm, setShowForm] = useState(false);

    function remove(authorToDelete: Author): void {
        const newAuthors: Array<Author> = authors.filter((author: Author, index: number) => index !== authors.indexOf(authorToDelete))
        setData('authors', newAuthors);
    }

    function hideAndResetForm(): void {
        setShowForm(false)
        setName('')
        setOrganization('')
        setCountryId('')
        setCity('')
    }

    function addAuthor(): void {
        setData('authors', [...authors, { name: name, organization: organization, city: city, country_id: countryId }]);
        hideAndResetForm();
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">Соавторы</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                    {(authors.length > 0) &&
                        <div className="space-y-1">
                            {authors.map((author, index) => (
                                <div className="flex gap-2 items-center justify-between" key={index}>
                                    <p className="break-all">
                                        {`${author.name}: ${author.organization}, ${author.city}, ${countries.find((country) => country.id === Number(author.country_id))?.name}`}
                                    </p>
                                    <Button
                                        onClick={() => remove(author)}
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
                            <div className="grid gap-6">
                                <Button
                                    onClick={hideAndResetForm}
                                    type="button"
                                    variant={"outline"}
                                    size={"iconSmall"}>
                                    <CircleX />
                                </Button>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Имя</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="organization">Организация</Label>
                                    <Input
                                        id="organization"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        value={organization}
                                        onChange={(e) => setOrganization(e.target.value)}
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="city">Город</Label>
                                    <Input
                                        id="city"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="country_id">Страна</Label>
                                    <Select name="country_id" value={countryId} onValueChange={(country_id) => setCountryId(country_id)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Выберите страну автора" />
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
                                    <InputError message={errors.type_id} className="mt-2" />
                                </div>


                                {(name && organization && city && countryId) &&
                                    <Button
                                        className="text-sm"
                                        onClick={addAuthor}
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

