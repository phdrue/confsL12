import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Conference, ConferenceType } from '@/types/conferences';
import { useToast } from "@/hooks/use-toast"

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { User } from "@/types";

export default function ResponsibleForm({
    conference,
    users
}: {
    users: Array<User>,
    conference: Conference
}) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const [userId, setUserId] = useState('');

    const { toast } = useToast()
    const { post, processing, errors, reset } = useForm({
        _method: 'put'
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('adm.conferences.toggle-responsible', [conference.id, userId]), {
            forceFormData: true,
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: "Ответственный успешно создана!",
                })
                reset()
                setUserId('')
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Добавить</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Добавить ответственного</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="user_id">Пользователь</Label>
                            <Select name="user_id" value={userId} onValueChange={(user_id) => setUserId(user_id)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите пользователя" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={String(user.id)}>{user.email}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {userId && <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Создать
                        </Button>}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
