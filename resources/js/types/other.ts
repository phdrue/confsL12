export type DataTableFilter = DataTableSelectFilter | DataTableTextFilter

export type DataTableSelectFilter = {
    type: 'select'
    name: string
    data: {
        label: string
        placeholder: string
        options: Array<{ id: string; name: string }>
    }
}

export type DataTableTextFilter = {
    type: 'text'
    name: string
    data: {
        placeholder: string
    }
}
