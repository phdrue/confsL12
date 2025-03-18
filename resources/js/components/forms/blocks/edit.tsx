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
import { Button } from "@/components/ui/button";
import { ConferenceBlock } from "@/types/blocks";
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from "lucide-react";
import RenderBlockForm from "@/components/forms/blocks/render-form";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";

export function EditConferenceBlockForm({
    block,
    openEdit,
    setOpenEdit,
    toast,
}: {
    block?: ConferenceBlock | null,
    openEdit: boolean,
    setOpenEdit: (openEdit: boolean) => void,
    toast: any
}) {
    const { data, setData, put, reset, processing, errors, clearErrors } = useForm({
        type_id: block?.type_id,
        name: block?.name,
        content: block?.content
    })

    useEffect(() => {
        clearErrors()
        setData({
            type_id: block?.type_id,
            name: block?.name,
            content: block?.content
        })
    }, [block])

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        put(route('adm.blocks.update', block?.id), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Блок конференции успешно обновлен!",
                })
            }
        })
    }

    return (
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="max-w-full sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Редактирование блока</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div className="w-full mx-auto py-32">
                    <form onSubmit={submit} className="space-y-4">
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
                        {/* main */}
                        <RenderBlockForm errors={errors} content={data.content} setData={setData} blockTypeId={Number(block?.type_id)} />
                        <Button type="submit" className="w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Обновить
                        </Button>
                    </form>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Закрыть
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}