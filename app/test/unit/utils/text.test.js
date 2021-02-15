import * as all from '$shared/utils/text'

describe('text utils', () => {
    describe('truncate', () => {
        it('does not truncate non-strings', () => {
            expect(all.truncate()).toBe(undefined)
            expect(all.truncate(123)).toBe(123)
        })

        it('does not truncate non-eth address', () => {
            expect(all.truncate('sandbox/test/my-stream')).toBe('sandbox/test/my-stream')
            expect(all.truncate('FwhuQBTrtfkddf2542asd')).toBe('FwhuQBTrtfkddf2542asd')
        })

        it('truncates paths starting with eth address', () => {
            expect(all.truncate('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1/test/my-stream')).toBe('0xa3d...47De1/test/my-stream')
            expect(all.truncate('0xA3D1F77ACFF0060F7213D7BF3C7fEC78DF847DE1/test/my-stream')).toBe('0xA3D...47DE1/test/my-stream')
        })

        it('truncates address in the middle of text', () => {
            expect(all.truncate('address is 0xA3D1F77ACFF0060F7213D7BF3C7fEC78DF847DE1 inside text'))
                .toBe('address is 0xA3D...47DE1 inside text')
        })

        it('truncates paths with mutiple eth address', () => {
            expect(all.truncate('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1/test/0x13581255eE2D20e780B0cD3D07fac018241B5E03/path'))
                .toBe('0xa3d...47De1/test/0x135...B5E03/path')
        })

        it('only truncates valid eth addresses', () => {
            expect(all.truncate('0xa3d1F77ACfF3c7fEC78df847De1/test/my-stream')).toBe('0xa3d1F77ACfF3c7fEC78df847De1/test/my-stream')
        })

        it('truncates single eth address', () => {
            expect(all.truncate('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1')).toBe('0xa3d...47De1')
            expect(all.truncate('0xA3D1F77ACFF0060F7213D7BF3C7fEC78DF847DE1')).toBe('0xA3D...47DE1')
        })

        it('truncates using custom separator', () => {
            expect(all.truncate('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1/path/to/stream', {
                separator: '---',
            })).toBe('0xa3d---47De1/path/to/stream')
        })

        it('truncates transaction hash', () => {
            expect(all.truncate('0x8b549d1526d0f6168eed061041d6cb5243c2c283b6d35cf41fe9c95b1e606ff1'))
                .toBe('0x8b5...06ff1')
        })

        it('truncates to custom length', () => {
            expect(all.truncate('0x8b549d1526d0f6168eed061041d6cb5243c2c283b6d35cf41fe9c95b1e606ff1', {
                length: 10,
            }))
                .toBe('0x8b549d15...5b1e606ff1')

            expect(all.truncate('address is 0x8b549d1526d0f6168eed061041d6cb5243c2c283b6d35cf41fe9c95b1e606ff1 inside text', {
                length: 10,
            }))
                .toBe('address is 0x8b549d15...5b1e606ff1 inside text')
        })

        it('truncates to custom length (40 characters vs less)', () => {
            expect(all.truncate('0x8b549d1526d0f6168eed061041d6cb5243c2cf40', {
                length: 12,
            }))
                .toBe('0x8b549d1526...cb5243c2cf40')

            expect(all.truncate('address is 0x8b549d1526d0f6168eed061041d6cb5243c2cf40 inside text', {
                length: 12,
            }))
                .toBe('address is 0x8b549d1526...cb5243c2cf40 inside text')

            // 39 characters
            expect(all.truncate('0x8b549d1526d0f6168eed061041d6cb5243c2c39', {
                length: 12,
            }))
                .toBe('0x8b549d1526d0f6168eed061041d6cb5243c2c39')

            expect(all.truncate('address is 0x8b549d1526d0f6168eed061041d6cb5243c2c39 inside text', {
                length: 12,
            }))
                .toBe('address is 0x8b549d1526d0f6168eed061041d6cb5243c2c39 inside text')
        })

        it('respects the implicit maximum length', () => {
            expect(all.truncate('0x8b549d1526d0f6168eed061041d6cb5243c2cf40', {
                length: 20,
            })).toBe('0x8b549d1526d0f6168eed061041d6cb5243c2cf40')

            expect(all.truncate('0x8b549d1526d0f6168eed061041d6cb5243c2cf40', {
                length: 19,
            })).toBe('0x8b549d1526d0f6168...61041d6cb5243c2cf40')
        })

        it('respects the implicit minimum length of 3', () => {
            expect(all.truncate('0x8b549d1526d0f6168eed061041d6cb5243c2cf40', {
                length: 0,
            })).toBe('0x8...f40')
        })
    })

    describe('numberToText', () => {
        it('returns negative number untranslated', () => {
            expect(all.numberToText(-12)).toBe('-12')
        })

        it('translates round numbers', () => {
            expect(all.numberToText(0)).toBe('zero')
            expect(all.numberToText(1)).toBe('one')
            expect(all.numberToText(2)).toBe('two')
            expect(all.numberToText(3)).toBe('three')
            expect(all.numberToText(4)).toBe('four')
            expect(all.numberToText(5)).toBe('five')
            expect(all.numberToText(6)).toBe('six')
            expect(all.numberToText(7)).toBe('seven')
            expect(all.numberToText(8)).toBe('eight')
            expect(all.numberToText(9)).toBe('nine')
            expect(all.numberToText(10)).toBe('ten')
            expect(all.numberToText(100)).toBe('hundred')
            expect(all.numberToText(1000)).toBe('thousand')
            expect(all.numberToText(10000)).toBe('tenThousand')
            expect(all.numberToText(100000)).toBe('hundredThousand')
            expect(all.numberToText(1000000)).toBe('million')
        })

        it('doesnt translate specific numbers', () => {
            expect(all.numberToText(12)).toBe('12')
            expect(all.numberToText(111)).toBe('111')
            expect(all.numberToText(1012)).toBe('1012')
            expect(all.numberToText(65231)).toBe('65231')
        })
    })
})
