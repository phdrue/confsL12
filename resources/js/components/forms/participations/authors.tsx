import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import { Plus, BadgeCheck, CircleX, Trash2, WandSparkles } from "lucide-react"
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
import type { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";

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
    const { auth } = usePage<SharedData>().props;
    const [name, setName] = useState('');
    const [organization, setOrganization] = useState('');
    const [city, setCity] = useState('');
    const [countryId, setCountryId] = useState('');

    const [showForm, setShowForm] = useState(false);

    function remove(authorToDelete: Author): void {
        const newAuthors: Array<Author> = authors.filter((author: Author, index: number) => index !== authors.indexOf(authorToDelete))
        setData(newAuthors);
    }

    function hideAndResetForm(): void {
        setShowForm(false)
        setName('')
        setOrganization('')
        setCountryId('')
        setCity('')
    }

    function addAuthor(): void {
        setData([...authors, { name: name, organization: organization, city: city, country_id: countryId }]);
        hideAndResetForm();
    }

    function addUserAsAuthor(): void {
        if (auth.user) {
            setData([...authors, { name: auth.user.first_name, organization: auth.user.organization, city: auth.user.city, country_id: auth.user.country_id }]);
        }
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
                        {auth.user.first_name === null ? <p className="italic text-xs text-red-500 mb-2">
                            Заполните данные профиля, чтобы быстро добавлять себя как автора
                        </p> : <Button
                            onClick={addUserAsAuthor}
                            type="button"
                            variant={"outline"}
                            size={"iconSmall"}
                            className="mr-2">
                            <WandSparkles />
                        </Button>
                        }

                        {!showForm ? <Button
                            onClick={() => setShowForm(true)}
                            type="button"
                            variant={"outline"}
                            size={"iconSmall"}>
                            <Plus />
                        </Button> :
                            <div className="">
                                <Button
                                    onClick={hideAndResetForm}
                                    type="button"
                                    variant={"outline"}
                                    size={"iconSmall"}>
                                    <CircleX />
                                </Button>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">ФИО автора</Label>
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
                                            Добавить соавтора
                                        </Button>
                                    }
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

