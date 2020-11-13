export default function isValidUserId(value) {
    const v = typeof value === 'string' ? value.trim() : ''
    return v === 'anonymous' || v.startsWith('0x') || v.includes('@')
}
