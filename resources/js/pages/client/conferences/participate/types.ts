import { Conference, ReportType } from '@/types/conferences';
import { Country, Degree, Report, Thesis, Title } from '@/types/other';

export type WizardStep = 'choice' | 'thesis' | 'report' | 'finish';

export type WizardDraft = {
    reports: Array<Report & { key: string }>;
    thesises: Array<Thesis & { key: string }>;
};

export type ParticipationWizardPageProps = {
    conference: Conference;
    documents: WizardDraft;
    countries: Array<Country>;
    degrees: Array<Degree>;
    titles: Array<Title>;
    reportTypes: Array<ReportType>;
    participation?: { id: number; confirmed: boolean } | null;
    canEditDocuments: boolean;
    canFinish: boolean;
    canAddThesis: boolean;
    canAddReport: boolean;
};
