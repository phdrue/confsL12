import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { User } from '@/types'
import { Degree, Title } from '@/types/other'
import { ConferenceParticipationBadge } from '@/components/conferences/utils'
import { Separator } from '@/components/ui/separator'

interface ParticipationDocuments {
    reports: Array<{
        id: number
        topic: string
        report_type_id: number | null
        report_type?: { id: number; name: string } | null
        authors: Array<any>
        science_guides: Array<any>
    }>
    thesises: Array<{
        id: number
        topic: string
        text: string | null
        literature: string | null
        authors: Array<any>
        science_guides: Array<any>
    }>
}

interface Participation {
    id: number
    confirmed: boolean
}

interface ParticipationDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User & {
        participation_documents?: ParticipationDocuments
        participation?: Participation | null
    }
    degrees: Array<Degree>
    titles: Array<Title>
}

export function ParticipationDetailsDialog({
    open,
    onOpenChange,
    user,
    degrees,
    titles,
}: ParticipationDetailsDialogProps) {
    const getDegreeName = (degreeId: number | null): string => {
        if (!degreeId) return ''
        const degree = degrees.find((d) => d.id === degreeId)
        return degree?.name || ''
    }

    const getTitleName = (titleId: number | null): string => {
        if (!titleId) return ''
        const title = titles.find((t) => t.id === titleId)
        return title?.name || ''
    }

    const documents = user.participation_documents || { reports: [], thesises: [] }
    const participation = user.participation

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Данные об участии</DialogTitle>
                    <DialogDescription>
                        Полная информация об участии и документах участника
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* User Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Информация об участнике</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">ФИО</p>
                                <p className="font-medium">
                                    {[user.last_name, user.first_name, user.second_name]
                                        .filter(Boolean)
                                        .join(' ') || 'Не указано'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Телефон</p>
                                <p className="font-medium">{user.phone || 'Не указано'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Организация</p>
                                <p className="font-medium">{user.organization || 'Не указано'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Должность</p>
                                <p className="font-medium">{user.position || 'Не указано'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Город</p>
                                <p className="font-medium">{user.city || 'Не указано'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Ученая степень</p>
                                <p className="font-medium">{getDegreeName(user.degree_id) || 'Не указано'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Ученое звание</p>
                                <p className="font-medium">{getTitleName(user.title_id) || 'Не указано'}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Participation Status */}
                    {participation && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Статус участия</h3>
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Участие подтверждено
                                </p>
                                <ConferenceParticipationBadge confirmed={participation.confirmed} />
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {(documents.reports.length > 0 || documents.thesises.length > 0) && (
                        <>
                            <Separator />
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Документы</h3>

                                {/* Reports */}
                                {documents.reports.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Доклады ({documents.reports.length})</h4>
                                        {documents.reports.map((report, index) => (
                                            <div
                                                key={report.id}
                                                className="border rounded-lg p-4 space-y-3"
                                            >
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Доклад #{index + 1}
                                                    </p>
                                                    <p className="font-medium">{report.topic}</p>
                                                </div>
                                                {report.report_type && (
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Тип доклада
                                                        </p>
                                                        <p className="font-medium">
                                                            {report.report_type.name}
                                                        </p>
                                                    </div>
                                                )}
                                                {report.authors && report.authors.length > 0 && (
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Авторы
                                                        </p>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {report.authors.map((author, idx) => (
                                                                <li key={idx} className="text-sm">
                                                                    {typeof author === 'string'
                                                                        ? author
                                                                        : `${author.name || ''}${author.organization ? ` (${author.organization})` : ''}`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {report.science_guides &&
                                                    report.science_guides.length > 0 && (
                                                        <div>
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                Научные руководители
                                                            </p>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                {report.science_guides.map((guide, idx) => (
                                                                    <li key={idx} className="text-sm">
                                                                        {guide.name || ''}
                                                                        {guide.degree && `, ${guide.degree}`}
                                                                        {guide.title && `, ${guide.title}`}
                                                                        {guide.organization &&
                                                                            ` (${guide.organization})`}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Thesises */}
                                {documents.thesises.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">
                                            Тезисы ({documents.thesises.length})
                                        </h4>
                                        {documents.thesises.map((thesis, index) => (
                                            <div
                                                key={thesis.id}
                                                className="border rounded-lg p-4 space-y-3"
                                            >
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Тезис #{index + 1}
                                                    </p>
                                                    <p className="font-medium">{thesis.topic}</p>
                                                </div>
                                                {thesis.text && (
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Текст тезиса
                                                        </p>
                                                        <p className="text-sm whitespace-pre-wrap">
                                                            {thesis.text}
                                                        </p>
                                                    </div>
                                                )}
                                                {thesis.literature && (
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Литература
                                                        </p>
                                                        <p className="text-sm whitespace-pre-wrap">
                                                            {thesis.literature}
                                                        </p>
                                                    </div>
                                                )}
                                                {thesis.authors && thesis.authors.length > 0 && (
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Авторы
                                                        </p>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {thesis.authors.map((author, idx) => (
                                                                <li key={idx} className="text-sm">
                                                                    {typeof author === 'string'
                                                                        ? author
                                                                        : `${author.name || ''}${author.organization ? ` (${author.organization})` : ''}`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {thesis.science_guides &&
                                                    thesis.science_guides.length > 0 && (
                                                        <div>
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                Научные руководители
                                                            </p>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                {thesis.science_guides.map((guide, idx) => (
                                                                    <li key={idx} className="text-sm">
                                                                        {guide.name || ''}
                                                                        {guide.degree && `, ${guide.degree}`}
                                                                        {guide.title && `, ${guide.title}`}
                                                                        {guide.organization &&
                                                                            ` (${guide.organization})`}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* No Documents */}
                    {documents.reports.length === 0 && documents.thesises.length === 0 && (
                        <>
                            <Separator />
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    Документы не загружены
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
