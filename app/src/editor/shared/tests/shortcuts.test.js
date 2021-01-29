import { getShortcutChord, SHORTCUT_CHORDS } from '$editor/shared/utils/shortcuts'
import UserAgents from '$shared/../../test/unit/utils/useragents'

describe('getShortcutChord', () => {
    test('mac desktop chrome', () => {
        expect(getShortcutChord(UserAgents.MacDesktopChrome)).toEqual(SHORTCUT_CHORDS.Chrome.mac)
    })
    test('win desktop chrome', () => {
        expect(getShortcutChord(UserAgents.WindowsDesktopChrome)).toEqual(SHORTCUT_CHORDS.Chrome.default)
    })
    test('linux desktop firefox', () => {
        expect(getShortcutChord(UserAgents.LinuxDesktopFirefox)).toEqual(SHORTCUT_CHORDS.Firefox.default)
    })
    test('win desktop IE11', () => {
        expect(getShortcutChord(UserAgents.WindowsDesktopIE11)).toEqual(SHORTCUT_CHORDS.IE.default)
    })
})
