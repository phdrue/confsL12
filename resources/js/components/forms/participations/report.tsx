import { CircleX, LoaderCircle, Plus, Trash2, WandSparkles } from 'lucide-react';
import { FormEventHandler, useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AuthorsFormPartial from './authors';
import { Country, Report } from '@/types/other';
import { Conference, ReportType } from "@/types/conferences";
import InputError from "@/components/input-error";

export default function ReportParticipationForm({
    reports,
    errors,
    setData,
    conference,
    reportTypes,
    countries
}: {
    reports: Array<Report>,
    errors: any,
    setData: any,
    conference: Conference,
    reportTypes: Array<ReportType>,
    countries: Array<Country>
}) {
    const [topic, setTopic] = useState('');
    const [reportTypeId, setReportTypeId] = useState('');
    const [authors, setAuthors] = useState([]);

    const [showForm, setShowForm] = useState(false);

    function hideAndResetForm(): void {
        setShowForm(false)
        setTopic('')
        setReportTypeId('')
        setAuthors([])
    }

    function addToContent(): void {
        setData('reports', [...reports, { topic, report_type_id: reportTypeId, authors }]);
        hideAndResetForm();
    }

    function remove(itemRemove: Report): void {
        const newContent = reports.filter((item: Report, index: number) => index !== reports.indexOf(itemRemove))
        setData('reports', newContent);
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">Приложенные доклады</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                    {(reports.length > 0) &&
                        <div className="space-y-1">
                            {reports.map((report, index) => (
                                <div className="flex gap-2 items-center justify-between" key={index}>
                                    <p className="break-all">{report.topic}</p>

                                    <Button
                                        onClick={() => remove(report)}
                                        type="button"
                                        className="shrink-0 hover:text-red-600"
                                        variant={"outline"}
                                        size={"iconSmall"}>
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    }
                    <div>
                        {!showForm ? <Button
                            onClick={() => setShowForm(true)}
                            type="button"
                            variant={"outline"}
                            size={"iconSmall"}>
                            <Plus />
                        </Button> :
                            <div className="space-y-4">
                                <Button
                                    onClick={hideAndResetForm}
                                    type="button"
                                    variant={"outline"}
                                    size={"iconSmall"}>
                                    <CircleX />
                                </Button>
                                <div className="grid gap-6">
                                    <div>
                                        <AuthorsFormPartial countries={countries} setData={setAuthors} authors={authors} errors={errors} />
                                        <InputError message={errors.authors} className="mt-2" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="report_type_id">Вид доклада</Label>
                                        <Select
                                            required={true}
                                            name="report_type_id"
                                            value={reportTypeId}
                                            onValueChange={(report_type_id) => setReportTypeId(report_type_id)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Выберите вид доклада" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Виды</SelectLabel>
                                                    {reportTypes.map((type) => (
                                                        <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="topic">Тема доклада</Label>
                                        <Textarea
                                            id="topic"
                                            maxLength={2000}
                                            name="topic"
                                            value={topic}
                                            className="w-full"
                                            autoComplete="topic"
                                            required
                                            onChange={(e) => setTopic(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {(topic && reportTypeId && authors.length > 0) &&
                                    <Button
                                        className="text-sm"
                                        onClick={addToContent}
                                        type="button"
                                        variant={"outline"}
                                    >
                                        Добавить
                                    </Button>
                                }
                            </div>}
                        <InputError message={errors.content} className="mt-2" />
                        <InputError message={errors["content.items"]} className="mt-2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
