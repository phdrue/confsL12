import ConsentDialog from '@/components/forms/participations/consent-dialog';
import DraftDocumentList from '@/components/forms/participations/draft-document-list';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ParticipationWizardLayout from './layout';
import { ParticipationWizardPageProps } from './types';

const FINISH_DELAY_SECONDS = 10;

export default function ParticipationFinishPage({
    conference,
    draft,
}: ParticipationWizardPageProps) {
    const { errors } = usePage().props as { errors: Record<string, string> };
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
        <ParticipationWizardLayout conference={conference} title="Закончить подачу">
            <Link
                href={route('client.conferences.participation', conference.id)}
                className="text-sm text-muted-foreground underline-offset-2 hover:underline"
            >
                Назад
            </Link>

            <h1 className="mt-4 text-2xl font-semibold">Закончить подачу</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                Проверьте черновик. После подтверждения заявка будет сохранена, и черновик очистится.
            </p>

            {Boolean(conference.allow_thesis) && (
                <div className="mt-8">
                    <h2 className="mb-2 text-base font-semibold">Тезисы</h2>
                    <DraftDocumentList items={draft.thesises} canDelete={false} onDelete={() => undefined} />
                </div>
            )}
            {Boolean(conference.allow_report) && (
                <div className="mt-8">
                    <h2 className="mb-2 text-base font-semibold">Доклады</h2>
                    <DraftDocumentList items={draft.reports} canDelete={false} onDelete={() => undefined} />
                </div>
            )}

            <InputError message={errors.authorization ?? errors.reports ?? errors.thesises} className="mt-6" />

            <Button
                type="button"
                className="mt-8 w-full"
                disabled={remaining > 0}
                onClick={() => setConsentOpen(true)}
            >
                {remaining > 0 ? `Закончить подачу (${remaining})` : 'Закончить подачу'}
            </Button>

            <ConsentDialog
                open={consentOpen}
                onOpenChange={setConsentOpen}
                title="Закончить подачу?"
                description="Черновик будет сохранён как заявка на конференцию."
                confirmLabel="Закончить подачу"
                onConfirm={() => router.post(route('client.conferences.participation.finish.store', conference.id))}
            />
        </ParticipationWizardLayout>
    );
}
