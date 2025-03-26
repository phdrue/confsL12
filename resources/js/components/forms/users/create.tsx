import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, ChangeEvent } from 'react';
import { ConferenceType } from '@/types/conferences';
import { useToast } from "@/hooks/use-toast"

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog"

export default function CreateUserForm({ }) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        first_name: '',
        last_name: '',
        second_name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('adm.users.store'), {
            forceFormData: true,
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: "Пользователь успешно!",
                })
                reset()
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Создать</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Создание корпоративного аккаунта</DialogTitle>
                    <DialogDescription>
                        Заполните основные поля
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">

                        <div className="grid gap-2">
                            <Label htmlFor="email">Адрес электронной почты</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Фамилия</Label>

                            <Input
                                id="last_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                required
                                placeholder="Фамилия"
                            />

                            <InputError className="mt-2" message={errors.last_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">Имя</Label>

                            <Input
                                id="first_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                required
                                placeholder="Имя"
                            />

                            <InputError className="mt-2" message={errors.first_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="second_name">Отчество</Label>

                            <Input
                                id="second_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.second_name}
                                onChange={(e) => setData('second_name', e.target.value)}
                                required
                                placeholder="Отчество"
                            />

                            <InputError className="mt-2" message={errors.second_name} />
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Создать
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
