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
    pivot?: {
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