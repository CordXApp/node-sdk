export function getTimestamp(): string {
    const now = new Date()
    return now.toISOString()
}
