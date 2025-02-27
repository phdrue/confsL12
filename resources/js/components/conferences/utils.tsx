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
        case 2: return (<Badge variant="emerald">Актуальная</Badge>)
        case 3: return (<Badge variant="amber">Архив</Badge>)
    }
}

export function ConferenceParticipationBadge({ type_id }: { type_id: number }) {
    switch (type_id) {
        case 1: return (<Badge variant="blue">Участие</Badge>)
        case 2: return (<Badge variant="emerald">Доклад</Badge>)
        case 3: return (<Badge variant="amber">Тезисы</Badge>)
    }
}
