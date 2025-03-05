import { Conference, ConferenceState } from "@/types/conferences"
import { FormEventHandler } from "react"
import { useForm } from "@inertiajs/react"
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';

export default function ChangeConferenceStateForm({
    conference,
    states
}: {
    conference: Conference,
    states: Array<ConferenceState>
}) {
    const { toast } = useToast()

    const { data, setData, post, processing, errors } = useForm({
        state_id: String(conference.state_id),
        _method: 'put'
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('adm.conferences.change-state', conference.id), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Статус конференции успешно обновлен!",
                })
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Изменение статуса</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="">
                    <div className="w-full mx-auto py-0">
                        <form onSubmit={submit} className="space-y-4" >
                            <div className="grid gap-2">
                                <Label htmlFor="state_id">Статус</Label>
                                <Select name="state_id" value={data.state_id} onValueChange={(state_id) => setData('state_id', state_id)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Выберите статус конференции" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Виды</SelectLabel>
                                            {states.map((state) => (
                                                <SelectItem key={state.id} value={String(state.id)}>{state.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.state_id} className="mt-2" />
                            </div>
                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Обновить
                            </Button>
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
