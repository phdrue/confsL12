import { useForm } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import RenderBlockForm from "@/components/forms/blocks/render-form";
import { useState, JSX } from "react";
import { Link, Dot, Heading, Loader2, Plus, BadgeCheck } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DialogDescription } from "@radix-ui/react-dialog";
import { ConferenceBlockType } from "@/types/blocks";

export default function CreateConferenceBlockForm({
    conferenceId,
    blockTypes
}: {
    conferenceId: number,
    blockTypes: Array<ConferenceBlockType>
}) {
    const { data, setData, post, reset, processing, errors } = useForm({
        type_id: '',
        conference_id: conferenceId,
        name: '',
        content: null as any | null
    })
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        post(route('adm.blocks.store'), {
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: "Блок конференции успешно создан!",
                })
                reset()
            }
        })
    }

    function handleTypeValueChange(type_id: string) {
        setData('type_id', type_id)

        switch (type_id) {
            case "1": {
                setData('content', { text: '' })
                setData('name', `Текст 1`)
                break
            }
            case "2": {
                setData('content', [])
                setData('name', `Список 1`)
                break
            }
            case "3": {
                setData('content', [])
                setData('name', `Ссылки 1`)
                break
            }
            case "4": {
                setData('content', {
                    tableDisplay: false,
                    colorDisplay: false,
                    items: []
                })
                setData('name', `Ключ-значение 1`)
                break
            }
            case "5": {
                setData('content', { colorDisplay: false, text: '' })
                setData('name', `Заголовок 1`)
                break
            }
            case "6": {
                setData('content', { text: '' })
                setData('name', `Дисклеймер 1`)
                break
            }
            case "7":
                setData('content', {})
                setData('name', `Разделитель 1`)
                break
            case "8":
                setData('content', { images: [] })
                setData('name', `Кнопки`)
                break
            case "9":
                setData('content', {})
                setData('name', `Изображения 1`)
                break
            default:
                return null;
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Создать</Button>
            </DialogTrigger>
            <DialogContent aria-description="Создание блока конференции" className="max-w-full sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Создание блока конференции</DialogTitle>
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
                        <div className="grid gap-2">
                            <Label htmlFor="type_id">Вид</Label>
                            <Select name="type_id" value={data.type_id} onValueChange={handleTypeValueChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите вид" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Виды</SelectLabel>
                                        {blockTypes.map((blockType) => (
                                            <SelectItem key={blockType.id} value={String(blockType.id)}>{blockType.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type_id} className="mt-2" />
                        </div>
                        {/* main */}
                        <RenderBlockForm errors={errors} content={data.content} setData={setData} blockTypeId={Number(data.type_id)} />
                        <Button disabled={processing} type="submit">{processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Сохраняю...
                            </>
                        ) : (
                            "Сохранить"
                        )}</Button>
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
