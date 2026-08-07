export function escapeCsvField(value: string): string {
    return /[",\r\n]/.test(value)
        ? `"${value.replace(/"/g, '""')}"`
        : value;
}

export function stringifyCsv(rows: string[][]): string {
    return rows
        .map((row) => row.map(escapeCsvField).join(','))
        .join('\n');
}