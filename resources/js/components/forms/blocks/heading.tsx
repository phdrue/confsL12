import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";

export default function HeadingTextBlockFormComponent({
    content,
    setData,
    errors
}: {
    content: any,
    setData: any,
    errors: any
}) {
    return (
        <>
            <div className="flex items-center space-x-3">
                <Checkbox id="color-display" checked={content.colorDisplay} onCheckedChange={(e) => setData('content', { ...content, colorDisplay: e === true })} name="color-display" tabIndex={3} />
                <Label htmlFor="color-display">Цветной вариант</Label>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="text">Заголовок</Label>
                <Input
                    id="name"
                    type="text"
                    required
                    tabIndex={1}
                    value={content.text}
                    onChange={(e) => setData('content', { ...content, text: e.target.value })}
                />
                <InputError message={errors.content} className="mt-2" />
                {errors["content.text"] && <InputError message={errors["content.text"]} className="mt-2" />}
            </div>
        </>
    )
}
