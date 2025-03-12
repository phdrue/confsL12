export interface Conference {
    id: number,
    name: string,
    description: string,
    date: string,
    img_path: string,
    front_page: boolean,
    state_id: number,
    type_id: number,
    primary_color: string,
    allow_thesis: boolean,
    allow_report: boolean,
    pivot?: {
        confirmed: boolean,
        type_id: number,
        state_id: number,
        conference_id: number,
        user_id: number
    }
}

export interface Proposal {
    id: number,
    name: string,
    engName: string,
    level: string,
    form: string,
    type: string,
    lang: string,
    date: Date,
    endDate: Date,
    place: string,
    // phone: string,
    department: string,
    organization: string,
    organizationOther: string,
    participationsTotal: number,
    participationsForeign: number,
     audiences: Array<string>,
    bookType: string,
    topics: string,
     amenities: Array<string>,
    budget: string,
    budgetSource: string,
    coverageInPerson: string,
    coverageOnline: string,
    coverageProfession: string
}

export interface ConferenceState {
    id: number,
    name: string
}

export interface ConferenceType {
    id: number,
    name: string
}

export interface Author {
    name: string,
    organization: string,
    city: string,
    country_id: number
}

export interface ReportType {
    id: number,
    name: string
}