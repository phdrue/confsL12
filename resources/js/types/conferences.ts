import { User } from '.';

export interface Conference {
    id: number;
    name: string;
    description: string;
    date: string;
    img_path: string;
    front_page: boolean;
    state_id: number;
    type_id: number;
    primary_color: string;
    allow_thesis: boolean;
    allow_report: boolean;
    proposal?: Proposal;
    pivot?: {
        confirmed: boolean;
    };
    is_starred?: boolean;
}

export interface Proposal {
    id: number;
    user_id: number;
    conference_id?: number;
    denied: boolean;
    user: User;
    img_path?: string | null;
    payload: {
        name: string;
        shortName: string;
        engName: string;
        engShortName: string;
        level: string;
        form: string;
        type: string;
        lang: string;
        date: string;
        endDate: string;
        place: string;
        // phone: string,
        department: string;
        organization: string;
        organizationOther: string;
        participationsTotal: number;
        participationsForeign: number;
        audiences: Array<string>;
        bookType: string;
        topics: string;
        budget: string;
        budgetSource: string;
        coverageInPerson: string;
        coverageOnline: string;
        coverageProfession: string;
    };
}

export interface ConferenceState {
    id: number;
    name: string;
}

export interface ConferenceType {
    id: number;
    name: string;
}

export interface Author {
    name: string;
    organization: string;
    city: string;
    country_id: number;
}

export interface ReportType {
    id: number;
    name: string;
}
