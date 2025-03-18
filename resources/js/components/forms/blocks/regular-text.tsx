import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";

export default function RegularTextBlockFormComponent({
    content,
    setData,
    errors
}: {
    content: any,
    setData: any,
    errors: any
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor="text">Текст</Label>
            <Textarea
                id="text"
                required
                tabIndex={1}
                value={content.text}
                onChange={(e) => setData('content', { text: e.target.value })}
            />
            <InputError message={errors.content} className="mt-2" />
            {errors["content.text"] && <InputError message={errors["content.text"]} className="mt-2" />}
        </div>
    )
}
