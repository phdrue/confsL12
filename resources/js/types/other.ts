export type DataTableFilter = DataTableSelectFilter | DataTableTextFilter

export type DataTableSelectFilter = {
    type: 'select'
    name: string
    data: {
        label: string
        placeholder: string
        options: Array<{ id: string | number; name: string }>
    }
}

export type DataTableTextFilter = {
    type: 'text'
    name: string
    data: {
        placeholder: string
    }
}

export type Country = {
    id: number
    name: string
}

export type Degree = {
    id: number
    name: string
}

export type Title = {
    id: number
    name: string
}

export type ScienceGuide = {
    name: string
    degree: string
    title: string
    city: string
    country_id: string | number
    organization: string
}

export interface Report {
    id?: number,
    topic: string,
    report_type_id: string,
    authors: Array<any>,
    science_guides: Array<ScienceGuide>
}

export interface Thesis {
    id?: number,
    topic: string,
    text: string,
    literature: string,
    authors: Array<any>,
    science_guides: Array<ScienceGuide>
}
