export type DataTableFilter = DataTableSelectFilter | DataTableTextFilter

export type DataTableSelectFilter = {
    type: 'select'
    name: string
    data: {
        label: string
        placeholder: string
        options: Array<{ id: number; name: string }>
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

export interface Report {
    topic: string,
    report_type_id: string,
    authors: Array<any>
}

export interface Thesis {
    topic: string,
    text: string,
    literature: string,
    authors: Array<any>
}
