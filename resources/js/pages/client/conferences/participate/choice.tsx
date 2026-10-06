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
    const isEditing = Boolean(participation);

    return (
        <ParticipationWizardLayout conference={conference} title={isEditing ? 'Управление заявкой' : 'Подача заявки'}>
            <h1 className="text-2xl font-semibold">{conference.name}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                {isEditing
                    ? 'Выберите действие. Сохранённая заявка не изменится, пока вы не закончите подачу.'
                    : 'Выберите действие. Заявка не будет отправлена, пока вы не закончите подачу.'}
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
                            <p className="text-sm text-muted-foreground">В заявке: {thesisCount}</p>
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
                            <p className="text-sm text-muted-foreground">В заявке: {reportCount}</p>
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
                            <p className="text-sm text-muted-foreground">
                                {isEditing ? 'Сохранить изменения заявки' : 'Отправить заявку'}
                            </p>
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
                    {isEditing ? 'Выйти из редактирования' : 'Выйти без сохранения'}
                </Button>
            )}

            <ConsentDialog
                open={resetOpen}
                onOpenChange={setResetOpen}
                title={isEditing ? 'Выйти из редактирования?' : 'Выйти без сохранения?'}
                description={
                    isEditing
                        ? 'Несохранённые изменения будут потеряны. Сохранённая заявка останется без изменений.'
                        : 'Заявка не будет отправлена. Добавленные документы не сохранятся.'
                }
                confirmLabel="Выйти"
                onConfirm={() => router.post(route('client.conferences.participation.draft.reset', conference.id))}
            />
        </ParticipationWizardLayout>
    );
}
