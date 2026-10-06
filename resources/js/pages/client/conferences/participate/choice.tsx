import ConsentDialog from '@/components/forms/participations/consent-dialog';
import DraftDocumentList from '@/components/forms/participations/draft-document-list';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import ParticipationWizardLayout from './layout';
import { ParticipationWizardPageProps } from './types';

export default function ParticipationChoicePage({
    conference,
    draft,
    canEditDocuments,
    canFinish,
    canAddThesis,
    canAddReport,
    participation,
}: ParticipationWizardPageProps) {
    const [resetOpen, setResetOpen] = useState(false);
    const thesisCount = draft.thesises.length;
    const reportCount = draft.reports.length;

    return (
        <ParticipationWizardLayout conference={conference} title={participation ? 'Управление заявкой' : 'Участие'}>
            <h1 className="text-2xl font-semibold">{conference.name}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                Выберите действие. Ничего не отправляется организаторам, пока вы не закончите подачу.
            </p>

            {(canAddThesis || canAddReport || canFinish) && (
            <div className="mt-8 divide-y rounded-xl border bg-white">
                {canAddThesis && (
                    <Link
                        href={route('client.conferences.participation.thesis', conference.id)}
                        className="flex items-center justify-between gap-3 px-4 py-4 hover:bg-muted/40"
                    >
                        <div>
                            <p className="font-medium">Добавить тезис</p>
                            <p className="text-sm text-muted-foreground">В черновике: {thesisCount}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </Link>
                )}
                {canAddReport && (
                    <Link
                        href={route('client.conferences.participation.report', conference.id)}
                        className="flex items-center justify-between gap-3 px-4 py-4 hover:bg-muted/40"
                    >
                        <div>
                            <p className="font-medium">Добавить доклад</p>
                            <p className="text-sm text-muted-foreground">В черновике: {reportCount}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </Link>
                )}
                {canFinish && (
                    <Link
                        href={route('client.conferences.participation.finish', conference.id)}
                        className="flex items-center justify-between gap-3 px-4 py-4 hover:bg-muted/40"
                    >
                        <div>
                            <p className="font-medium">Закончить подачу</p>
                            <p className="text-sm text-muted-foreground">Отправить заявку по текущему черновику</p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </Link>
                )}
            </div>
            )}

            {!canEditDocuments && (
                <p className="mt-4 text-sm text-muted-foreground">
                    Приём докладов и тезисов закрыт. Ниже показаны уже сохранённые документы.
                </p>
            )}

            <div className="mt-8 space-y-6">
                {Boolean(conference.allow_thesis) && (
                    <div>
                        <h2 className="mb-2 text-base font-semibold">Приложенные тезисы</h2>
                        <DraftDocumentList items={draft.thesises} canDelete={false} onDelete={() => undefined} />
                    </div>
                )}
                {Boolean(conference.allow_report) && (
                    <div>
                        <h2 className="mb-2 text-base font-semibold">Приложенные доклады</h2>
                        <DraftDocumentList items={draft.reports} canDelete={false} onDelete={() => undefined} />
                    </div>
                )}
            </div>

            {canEditDocuments && (
                <Button type="button" variant="outline" className="mt-8" onClick={() => setResetOpen(true)}>
                    Отменить черновик
                </Button>
            )}

            <ConsentDialog
                open={resetOpen}
                onOpenChange={setResetOpen}
                title="Отменить черновик?"
                description="Черновик будет возвращён к последней сохранённой заявке. Несохранённые изменения будут потеряны."
                confirmLabel="Отменить черновик"
                confirmVariant="destructive"
                onConfirm={() => router.post(route('client.conferences.participation.draft.reset', conference.id))}
            />
        </ParticipationWizardLayout>
    );
}
