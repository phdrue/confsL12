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