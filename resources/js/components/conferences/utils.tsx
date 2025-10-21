import { Badge } from "@/components/ui/badge"

export function ConferenceTypeBadge({ type_id }: { type_id: number }) {
    switch (type_id) {
        case 1: return (<Badge variant="outline">Региональный</Badge>)
        case 2: return (<Badge variant="outline">Всероссийский</Badge>)
        case 3: return (<Badge variant="outline">Международный</Badge>)
        case 4: return (<Badge variant="outline">Другой</Badge>)
    }
}

export function ConferenceStateBadge({ state_id }: { state_id: number }) {
    switch (state_id) {
        case 1: return (<Badge variant="rose">Черновик</Badge>)
        case 2: return (<Badge variant="blue">В плане</Badge>)
        case 3: return (<Badge variant="emerald">Актуальная</Badge>)
        case 4: return (<Badge variant="amber">Архив</Badge>)
    }
}

export function ConferenceParticipationBadge({ confirmed }: { confirmed: Boolean }) {
    switch (confirmed) {
        case false: return (<Badge variant="blue">Нет</Badge>)
        case true: return (<Badge variant="emerald">Да</Badge>)
    }
}
