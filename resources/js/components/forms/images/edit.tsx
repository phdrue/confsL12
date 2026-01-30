import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, ChangeEvent, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast"

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
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
import { Image, ImageCategory } from "@/types/blocks";

interface ImageEditFormProps {
    image: Image;
    categories: Array<ImageCategory>;
    trigger?: React.ReactNode;
}

export default function ImageEditForm({ image, categories, trigger }: ImageEditFormProps) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        name: image.name || '',
        url: image.url || '',
        category_id: String(image.category_id) || '',
        img: null as File | null
    });

    useEffect(() => {
        if (open) {
            reset()
            setData({
                name: image.name || '',
                url: image.url || '',
                category_id: String(image.category_id) || '',
                img: null
            })
        }
    }, [open, image])

    transform((data) => ({
        ...data,
        _method: 'put',
    }))

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setData('img', file)
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const hasFile = data.img !== null
        post(route('adm.images.update', image.id), {
            forceFormData: hasFile,
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: "Изображение успешно обновлено!",
                })
                reset()
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" className="w-full justify-start">
                        Редактировать
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Редактирование изображения</DialogTitle>
                    <DialogDescription/>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Категория изображения</Label>
                            <Select name="category_id" value={data.category_id} onValueChange={(category_id) => setData('category_id', category_id)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите категорию" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Название</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                tabIndex={1}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="url">Ссылка</Label>
                            <Input
                                id="url"
                                type="text"
                                required
                                tabIndex={1}
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                            />
                            <InputError message={errors.url} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="img">Изображение (оставьте пустым, чтобы не изменять)</Label>
                            <Input
                                id="img"
                                name="img"
                                type="file"
                                className="w-full"
                                autoComplete="img"
                                onChange={handleFileChange}
                            />
                            <InputError message={errors.img} className="mt-2" />
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Обновить
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
