import * as Linking from '../state/linking'

describe('Linking', () => {
    beforeEach(() => {
        global.localStorage.clear()
    })

    afterAll(() => {
        global.localStorage.clear()
    })

    test('getLink is false for no link', () => {
        expect(Linking.getLink('A')).not.toBeTruthy()
        expect(Linking.getLink('B')).not.toBeTruthy()
    })

    test('link works', () => {
        Linking.link('A', 'B')
        expect(Linking.getLink('A')).toBe('B')
        expect(Linking.getLink('B')).not.toBeTruthy()
        // linking again doesn't crash
        Linking.link('A', 'B')
        expect(Linking.getLink('A')).toBe('B')
    })

    test('link with bad values throws', () => {
        expect(() => {
            Linking.link(undefined, undefined)
        }).toThrow()
        expect(() => {
            Linking.link('A', undefined)
        }).toThrow()
        expect(() => {
            Linking.link(undefined, 'B')
        }).toThrow()
        expect(() => {
            Linking.link(null, null)
        }).toThrow()
        expect(() => {
            Linking.link('A', null)
        }).toThrow()
        expect(() => {
            Linking.link('A', '')
        }).toThrow()
        expect(() => {
            Linking.link('', 'A')
        }).toThrow()
        expect(() => {
            Linking.link('', '')
        }).toThrow()
    })

    test('unlink with bad values throws', () => {
        expect(() => {
            Linking.unlink(undefined)
        }).toThrow()
        expect(() => {
            Linking.unlink(null)
        }).toThrow()
        expect(() => {
            Linking.unlink({})
        }).toThrow()
        expect(() => {
            Linking.unlink('')
        }).toThrow()
    })

    test('getLink with bad values throws', () => {
        expect(() => {
            Linking.getLink(undefined)
        }).toThrow()
        expect(() => {
            Linking.getLink(null)
        }).toThrow()
        expect(() => {
            Linking.getLink({})
        }).toThrow()
        expect(() => {
            Linking.getLink('')
        }).toThrow()
    })

    test('unlink removes link', () => {
        Linking.link('A', 'B')
        Linking.unlink('A')
        expect(Linking.getLink('A')).not.toBeTruthy()
        // unlinking again doesn't crash
        Linking.unlink('A')
        expect(Linking.getLink('A')).not.toBeTruthy()
    })

    test('linking elsewhere works', () => {
        Linking.link('A', 'B')
        expect(Linking.getLink('A')).toBe('B')
        Linking.link('A', 'C')
        expect(Linking.getLink('A')).toBe('C')
        // linking again doesn't crash
        Linking.link('A', 'C')
        expect(Linking.getLink('A')).toBe('C')
    })
})
