import { useToast } from '@/hooks/use-toast';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ChoiceStep from './choice';
import FinishStep from './finish';
import ParticipationWizardLayout from './layout';
import ReportStep from './report';
import ThesisStep from './thesis';
import { ParticipationWizardPageProps, WizardStep } from './types';

function newKey(): string {
    return crypto.randomUUID();
}

function firstErrorMessage(errors: Record<string, string | string[] | undefined>): string | undefined {
    for (const key of ['authorization', 'reports', 'thesises'] as const) {
        const value = errors[key];
        if (typeof value === 'string' && value.length > 0) {
            return value;
        }
        if (Array.isArray(value) && value[0]) {
            return value[0];
        }
    }

    const first = Object.values(errors).find((value) => {
        if (typeof value === 'string') {
            return value.length > 0;
        }

        return Array.isArray(value) && value.length > 0;
    });

    if (typeof first === 'string') {
        return first;
    }

    if (Array.isArray(first)) {
        return first[0];
    }

    return undefined;
}

export default function ParticipationWizardPage({
    conference,
    documents,
    countries,
    degrees,
    titles,
    reportTypes,
    participation,
    canEditDocuments,
    canFinish,
    canAddThesis,
    canAddReport,
}: ParticipationWizardPageProps) {
    const { toast } = useToast();
    const [step, setStep] = useState<WizardStep>('choice');
    const { data, setData, post, processing, errors, isDirty } = useForm({
        reports: documents.reports,
        thesises: documents.thesises,
    });

    const isEditing = Boolean(participation);
    const title =
        step === 'thesis'
            ? 'Добавить тезис'
            : step === 'report'
              ? 'Добавить доклад'
              : step === 'finish'
                ? 'Закончить подачу'
                : isEditing
                  ? 'Управление заявкой'
                  : 'Подача заявки';

    const exitWizard = () => {
        router.visit(route('conferences.show', conference.id));
    };

    const finish = () => {
        post(route('client.conferences.participation.finish.store', conference.id), {
            onError: (err) => {
                setStep('finish');

                const message = firstErrorMessage(err);
                if (!message) {
                    return;
                }

                toast({
                    variant: 'destructive',
                    title: err.authorization ? 'Нет доступа к участию' : 'Не удалось завершить подачу',
                    description: message,
                });
            },
        });
    };

    return (
        <ParticipationWizardLayout conference={conference} title={title}>
            {step === 'choice' && (
                <ChoiceStep
                    conference={conference}
                    draft={data}
                    canEditDocuments={canEditDocuments}
                    canFinish={canFinish}
                    canAddThesis={canAddThesis}
                    canAddReport={canAddReport}
                    participation={participation}
                    isDirty={isDirty}
                    onGoThesis={() => setStep('thesis')}
                    onGoReport={() => setStep('report')}
                    onGoFinish={() => setStep('finish')}
                    onExit={exitWizard}
                />
            )}
            {step === 'thesis' && (
                <ThesisStep
                    participation={participation}
                    countries={countries}
                    degrees={degrees}
                    titles={titles}
                    thesises={data.thesises}
                    onBack={() => setStep('choice')}
                    onAdd={(thesis) => {
                        setData('thesises', [...data.thesises, { ...thesis, key: newKey() }]);
                        setStep('choice');
                    }}
                    onDelete={(key) => {
                        setData(
                            'thesises',
                            data.thesises.filter((item) => item.key !== key),
                        );
                    }}
                />
            )}
            {step === 'report' && (
                <ReportStep
                    participation={participation}
                    countries={countries}
                    degrees={degrees}
                    titles={titles}
                    reportTypes={reportTypes}
                    reports={data.reports}
                    onBack={() => setStep('choice')}
                    onAdd={(report) => {
                        setData('reports', [...data.reports, { ...report, key: newKey() }]);
                        setStep('choice');
                    }}
                    onDelete={(key) => {
                        setData(
                            'reports',
                            data.reports.filter((item) => item.key !== key),
                        );
                    }}
                />
            )}
            {step === 'finish' && (
                <FinishStep
                    conference={conference}
                    draft={data}
                    participation={participation}
                    processing={processing}
                    errors={errors}
                    onBack={() => setStep('choice')}
                    onFinish={finish}
                />
            )}
        </ParticipationWizardLayout>
    );
}
