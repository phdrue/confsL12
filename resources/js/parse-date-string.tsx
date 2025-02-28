export function parseDateString(dateString: string): Date {
    // Split the date string by the dot separator
    const [day, month, year] = dateString.split(".")

    // Create a new Date object (months are 0-indexed in JavaScript)
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}