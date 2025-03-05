import { Conference } from "@/types/conferences"
import { useForm } from "@inertiajs/react"
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import { FormEventHandler } from "react"

export default function ToggleFrontPageForm({
    conference,
}: {
    conference: Conference
}) {
    const { toast } = useToast()

    const { post, processing } = useForm({
        _method: 'put'
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('adm.conferences.toggle-front-page', conference.id), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Видимость конференции на главной странице была переключена!",
                })
            }
        })
    }

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Видимость на главной странице</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="">
                    <div className="w-full mx-auto py-0">
                        <form onSubmit={submit} className="space-y-4">
                            <fieldset className="space-y-2">
                                <Switch
                                    checked={conference.front_page}
                                />
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
