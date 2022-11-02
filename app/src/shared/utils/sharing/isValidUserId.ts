export default function isValidUserId(value: string): boolean {
    const v = typeof value === 'string' ? value.trim() : ''
    return v === 'anonymous' || v.startsWith('0x') || v.includes('@')
}
