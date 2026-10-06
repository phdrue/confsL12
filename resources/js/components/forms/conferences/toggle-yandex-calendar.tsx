import { Conference } from "@/types/conferences"
import { useForm } from "@inertiajs/react"
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import InputError from "@/components/input-error"
import { FormEventHandler } from "react"

export default function ToggleYandexCalendarForm({
    conference,
}: {
    conference: Conference
}) {
    const { toast } = useToast()

    const { post, processing, errors } = useForm({
        _method: 'put'
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('adm.conferences.toggle-yandex-calendar', conference.id), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Наличие конференции в Яндекс Календаре было переключено!",
                })
            }
        })
    }

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Видимость в Яндекс Календаре</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="">
                    <div className="w-full mx-auto py-0">
                        <form onSubmit={submit} className="space-y-4">
                            <fieldset className="space-y-2">
                                <Switch
                                    checked={!!conference.yandex_calendar_uid}
                                />
                                <InputError message={errors.yandex_calendar} />
                            </fieldset>
                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Сохранить
                            </Button>
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
