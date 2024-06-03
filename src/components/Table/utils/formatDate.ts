export default function formatDate(date: { seconds: number, nanoseconds: number }): string {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };
    return new Date(date.seconds * 1000).toLocaleString('en-US', options);
}

export function formatDateString(dateString: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };
    return new Date(dateString).toLocaleString('en-US', options);
}   