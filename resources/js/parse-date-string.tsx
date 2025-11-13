export function parseDateString(value: string | Date | null | undefined): Date {
    if (!value) {
        return new Date(0)
    }

    if (value instanceof Date) {
        return value
    }

    const dateString = String(value).trim()

    if (!dateString) {
        return new Date(0)
    }

    const dotParts = dateString.split(".")
    if (dotParts.length === 3) {
        const [day, month, year] = dotParts.map((part) => parseInt(part, 10))

        if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
            return new Date(year, month - 1, day)
        }
    }

    const timestamp = Date.parse(dateString)
    if (!Number.isNaN(timestamp)) {
        return new Date(timestamp)
    }

    return new Date(0)
}