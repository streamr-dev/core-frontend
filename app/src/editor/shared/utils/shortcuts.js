import platform, { isMac } from '$shared/utils/platform'

export const SHORTCUT_CHORDS = {
    Firefox: {
        default: ['alt', 'shift'],
        mac: ['control', 'alt'],
    },
    'Microsoft Edge': {
        default: ['alt'],
    },
    IE: {
        default: ['alt'],
    },
    Chrome: {
        default: ['alt', 'shift'],
        mac: ['control', 'alt'],
    },
    default: {
        default: ['alt'],
        mac: ['control', 'alt'],
    },
}

export function getShortcutChord(userAgent = navigator.userAgent) {
    const info = platform.parse(userAgent)
    const name = (info.name && info.name) || ''
    const browserShortcuts = SHORTCUT_CHORDS[name] || SHORTCUT_CHORDS.default
    const os = isMac(userAgent) ? 'mac' : 'default'
    return (browserShortcuts[os] || browserShortcuts.default)
}

export const chord = getShortcutChord()

export function isChordEvent(event) {
    const chord = getShortcutChord()
    return chord.every((key) => (
        event[`${key === 'control' ? 'ctrl' : key}Key`]
    ))
}
