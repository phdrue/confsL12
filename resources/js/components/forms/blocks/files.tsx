import { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button"
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FilesBlockFormComponent({
    content,
    setData,
    errors,
}: {
    content: any,
    setData: any,
    errors: any,
}) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    useEffect(() => {
        // Sync selectedFiles with form data
        if (setData && selectedFiles.length > 0) {
            setData('files', selectedFiles);
        }
    }, [selectedFiles, setData]);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter(file => {
            const isValidType = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                               file.type === 'application/pdf' ||
                               file.name.endsWith('.docx') ||
                               file.name.endsWith('.pdf');
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
            return isValidType && isValidSize;
        });
        
        setSelectedFiles(prev => [...prev, ...validFiles]);
        // Reset input
        e.target.value = '';
    }

    function removeFileFromSelection(fileToRemove: File) {
        const newFiles = selectedFiles.filter(file => file !== fileToRemove);
        setSelectedFiles(newFiles);
    }

    function removeFileFromContent(index: number) {
        const newContent = content.files.filter((_: { path: string; name: string }, i: number) => i !== index);
        setData('content', { files: newContent });
    }

    function moveUp(index: number): void {
        if (index === 0) return;
        const newFiles = [...content.files];
        [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
        setData('content', { files: newFiles });
    }

    function moveDown(index: number): void {
        if (index === content.files.length - 1) return;
        const newFiles = [...content.files];
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        setData('content', { files: newFiles });
    }

    return (
        <>
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-base">Содержимое поля файлов</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                    {/* Existing files */}
                    {content.files && content.files.length > 0 && (
                        <div className="w-full space-y-2">
                            <Label>Загруженные файлы</Label>
                            <div className="space-y-1">
                                {content.files.map((file: { path: string, name: string }, index: number) => (
                                    <div key={`file-${index}-${file.path}`} className="flex gap-2 items-center justify-between">
                                        <p className="break-all">{file.name}</p>
                                        <div className="flex gap-1 shrink-0">
                                            <Button
                                                onClick={() => moveUp(index)}
                                                type="button"
                                                className="hover:text-blue-600"
                                                variant={"outline"}
                                                size={"iconSmall"}
                                                disabled={index === 0}>
                                                <ChevronUp />
                                            </Button>
                                            <Button
                                                onClick={() => moveDown(index)}
                                                type="button"
                                                className="hover:text-blue-600"
                                                variant={"outline"}
                                                size={"iconSmall"}
                                                disabled={index === content.files.length - 1}>
                                                <ChevronDown />
                                            </Button>
                                            <Button
                                                onClick={() => removeFileFromContent(index)}
                                                type="button"
                                                className="shrink-0 hover:text-red-600"
                                                variant={"outline"}
                                                size={"iconSmall"}>
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* File upload */}
                    <div className="grid gap-2">
                        <Label htmlFor="files">Файлы (DOCX, PDF, макс. 10 МБ)</Label>
                        <input
                            id="files"
                            type="file"
                            multiple
                            accept=".docx,.pdf"
                            onChange={handleFileChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <InputError message={errors.files} />
                        <p className="text-sm text-muted-foreground">
                            Разрешены только файлы DOCX и PDF, максимальный размер файла - 10 МБ
                        </p>
                    </div>

                    {/* Selected files preview */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                            <Label>Выбранные файлы для загрузки</Label>
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="w-full flex grow gap-2 items-center justify-center">
                                    <div className="flex grow">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} МБ)</div>
                                    <Button
                                        onClick={() => removeFileFromSelection(file)}
                                        type="button"
                                        className="shrink-0 hover:text-red-600"
                                        variant={"outline"}
                                        size={"iconSmall"}>
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
