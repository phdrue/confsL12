import ConsentDialog from '@/components/forms/participations/consent-dialog';
import DraftDocumentList from '@/components/forms/participations/draft-document-list';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Conference } from '@/types/conferences';
import { useEffect, useState } from 'react';
import { WizardDraft } from './types';

const FINISH_DELAY_SECONDS = 5;

export default function FinishStep({
    conference,
    draft,
    participation,
    processing,
    errors,
    onBack,
    onFinish,
}: {
    conference: Conference;
    draft: WizardDraft;
    participation?: { id: number; confirmed: boolean } | null;
    processing: boolean;
    errors: Partial<Record<string, string>>;
    onBack: () => void;
    onFinish: () => void;
}) {
    const [remaining, setRemaining] = useState(FINISH_DELAY_SECONDS);
    const [consentOpen, setConsentOpen] = useState(false);

    useEffect(() => {
        const restart = () => {
            setRemaining(FINISH_DELAY_SECONDS);
            setConsentOpen(false);
        };

        restart();

        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                restart();
            }
        };

        document.addEventListener('visibilitychange', onVisibility);

        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, []);

    useEffect(() => {
        if (remaining <= 0) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setRemaining((value) => value - 1);
        }, 1000);

        return () => window.clearTimeout(timeout);
    }, [remaining]);

    return (
        <>
            <button
                type="button"
                className="text-sm text-muted-foreground underline-offset-2 hover:underline"
                onClick={onBack}
            >
                Назад
            </button>

            <h1 className="mt-4 text-2xl font-semibold">Закончить подачу</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                {participation
                    ? 'Проверьте заявку. После подтверждения изменения будут сохранены.'
                    : 'Проверьте заявку. После подтверждения она будет отправлена.'}
            </p>

            {Boolean(conference.allow_thesis) && draft.thesises.length > 0 && (
                <div className="mt-8">
                    <h2 className="mb-2 text-base font-semibold">Тезисы</h2>
                    <DraftDocumentList items={draft.thesises} canDelete={false} onDelete={() => undefined} />
                </div>
            )}
            {Boolean(conference.allow_report) && draft.reports.length > 0 && (
                <div className="mt-8">
                    <h2 className="mb-2 text-base font-semibold">Доклады</h2>
                    <DraftDocumentList items={draft.reports} canDelete={false} onDelete={() => undefined} />
                </div>
            )}

            <InputError message={errors.authorization ?? errors.reports ?? errors.thesises} className="mt-6" />

            <Button
                type="button"
                variant="destructive"
                className="mt-8 w-full"
                disabled={remaining > 0 || processing}
                onClick={() => setConsentOpen(true)}
            >
                {remaining > 0 ? `Закончить подачу (${remaining})` : 'Закончить подачу'}
            </Button>

            <ConsentDialog
                open={consentOpen}
                onOpenChange={setConsentOpen}
                title="Закончить подачу?"
                description={
                    participation
                        ? 'Изменения заявки будут сохранены.'
                        : 'Заявка будет отправлена.'
                }
                confirmLabel="Закончить подачу"
                confirmVariant="destructive"
                onConfirm={onFinish}
            />
        </>
    );
}
