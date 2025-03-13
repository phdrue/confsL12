import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button"
import { WandSparkles } from "lucide-react"

export default function DisclamerTextBlockFormComponent({
    content,
    setData,
    errors
}: {
    content: any,
    setData: any,
    errors: any
}) {
    const defaultText = "Руководство университета строго придерживается политики дедлайнов при управлении процессами. Это касается и организации научных мероприятий. Просьба отнестись к этому с пониманием и уважением. Окончательным временем обозначенной даты считается 00:01 даты, следующей за ней. Материалы, представленные позже указанного срока (дедлайна), не рассматриваются и не публикуются, регистрация прекращается!"

    function setDefaultText() {
        setData('content', { text: defaultText })
    }

    return (
        <div className="space-y-4">
            <Button
                onClick={setDefaultText}
                type="button"
                variant={"outline"}
                size={"iconSmall"}>
                <WandSparkles className="text-pink-500" />
            </Button>
            <div className="grid gap-2">
                <Label htmlFor="text">Текст</Label>
                <Input
                    id="name"
                    type="text"
                    required
                    tabIndex={1}
                    value={content.text}
                    onChange={(e) => setData('content', { text: e.target.value })}
                />
                <InputError message={errors.content} className="mt-2" />
                {errors["content.text"] && <InputError message={errors["content.text"]} className="mt-2" />}
            </div>
        </div>
    )
}
