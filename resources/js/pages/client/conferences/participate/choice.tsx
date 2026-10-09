import ConsentDialog from '@/components/forms/participations/consent-dialog';
import DraftDocumentList from '@/components/forms/participations/draft-document-list';
import { Button } from '@/components/ui/button';
import { Conference } from '@/types/conferences';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { WizardDraft } from './types';

export default function ChoiceStep({
    conference,
    draft,
    canEditDocuments,
    canFinish,
    canAddThesis,
    canAddReport,
    participation,
    isDirty,
    onGoThesis,
    onGoReport,
    onGoFinish,
    onExit,
}: {
    conference: Conference;
    draft: WizardDraft;
    canEditDocuments: boolean;
    canFinish: boolean;
    canAddThesis: boolean;
    canAddReport: boolean;
    participation?: { id: number; confirmed: boolean } | null;
    isDirty: boolean;
    onGoThesis: () => void;
    onGoReport: () => void;
    onGoFinish: () => void;
    onExit: () => void;
}) {
    const [leaveOpen, setLeaveOpen] = useState(false);
    const thesisCount = draft.thesises.length;
    const reportCount = draft.reports.length;
    const hasDocuments = thesisCount > 0 || reportCount > 0;
    const showTheses = Boolean(conference.allow_thesis) && thesisCount > 0;
    const showReports = Boolean(conference.allow_report) && reportCount > 0;
    const isEditing = Boolean(participation);

    return (
        <>
            <h1 className="text-2xl font-semibold">{conference.name}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                {isEditing
                    ? 'Выберите действие. Сохранённая заявка не изменится, пока вы не закончите подачу.'
                    : 'Выберите действие. Заявка не будет отправлена, пока вы не закончите подачу.'}
            </p>

            {(canAddThesis || canAddReport || canFinish) && (
                <div className="mt-8 divide-y rounded-xl border bg-white">
                    {canAddThesis && (
                        <button
                            type="button"
                            onClick={onGoThesis}
                            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left hover:bg-muted/40"
                        >
                            <div>
                                <p className="font-medium">Добавить тезис</p>
                                <p className="text-sm text-muted-foreground">В заявке: {thesisCount}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                        </button>
                    )}
                    {canAddReport && (
                        <button
                            type="button"
                            onClick={onGoReport}
                            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left hover:bg-muted/40"
                        >
                            <div>
                                <p className="font-medium">Добавить доклад</p>
                                <p className="text-sm text-muted-foreground">В заявке: {reportCount}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                        </button>
                    )}
                    {canFinish && (
                        <button
                            type="button"
                            onClick={onGoFinish}
                            className="flex w-full items-center justify-between gap-3 bg-destructive px-4 py-4 text-left text-destructive-foreground hover:bg-destructive/90"
                        >
                            <div>
                                <p className="font-medium">Закончить подачу</p>
                                <p className="text-sm text-destructive-foreground/80">
                                    {isEditing ? 'Сохранить изменения заявки' : 'Отправить заявку'}
                                </p>
                            </div>
                            <ChevronRight className="h-5 w-5 shrink-0 text-destructive-foreground/80" />
                        </button>
                    )}
                </div>
            )}

            {!canEditDocuments && (
                <p className="mt-4 text-sm text-muted-foreground">
                    {hasDocuments
                        ? 'Приём докладов и тезисов закрыт. Ниже показаны уже сохранённые документы.'
                        : isEditing
                          ? 'Приём докладов и тезисов закрыт.'
                          : 'Приём докладов и тезисов закрыт. Вы можете зарегистрироваться без подачи документов.'}
                </p>
            )}

            {(showTheses || showReports) && (
                <div className="mt-8 space-y-6">
                    {showTheses && (
                        <div>
                            <h2 className="mb-2 text-base font-semibold">Приложенные тезисы</h2>
                            <DraftDocumentList items={draft.thesises} canDelete={false} onDelete={() => undefined} />
                        </div>
                    )}
                    {showReports && (
                        <div>
                            <h2 className="mb-2 text-base font-semibold">Приложенные доклады</h2>
                            <DraftDocumentList items={draft.reports} canDelete={false} onDelete={() => undefined} />
                        </div>
                    )}
                </div>
            )}

            <Button
                type="button"
                variant="outline"
                className="mt-8"
                onClick={() => (isDirty ? setLeaveOpen(true) : onExit())}
            >
                {isEditing ? 'Выйти из редактирования' : 'Выйти без сохранения'}
            </Button>

            <ConsentDialog
                open={leaveOpen}
                onOpenChange={setLeaveOpen}
                title="Покинуть форму?"
                description={
                    isEditing
                        ? 'Несохранённые изменения будут потеряны. Сохранённая заявка останется без изменений.'
                        : 'Заявка не будет отправлена. Добавленные документы не сохранятся.'
                }
                confirmLabel="Покинуть"
                confirmVariant="destructive"
                onConfirm={onExit}
            />
        </>
    );
}
