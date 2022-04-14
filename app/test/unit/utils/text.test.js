import { numberToText, truncate } from '$shared/utils/text'

describe('text utils', () => {
    describe('truncate', () => {
        it('does not truncate non-strings', () => {
            expect(truncate()).toBe(undefined)
            expect(truncate(123)).toBe(123)
        })

        it('does not truncate hashes that are too short', () => {
            expect(truncate('0x0123456789abcdef0123456789abcdef01234567'))
                .toBe('0x012...34567')
            expect(truncate('0x0123456789abcdef0123456789abcdef0123456'))
                .toBe('0x0123456789abcdef0123456789abcdef0123456')
        })

        it('does not truncate non-eth address', () => {
            expect(truncate('sandbox/test/my-stream')).toBe('sandbox/test/my-stream')
            expect(truncate('FwhuQBTrtfkddf2542asd')).toBe('FwhuQBTrtfkddf2542asd')
        })

        it('truncates paths starting with eth address', () => {
            expect(truncate('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1/test/my-stream')).toBe('0xa3d...47De1/test/my-stream')
            expect(truncate('0xA3D1F77ACFF0060F7213D7BF3C7fEC78DF847DE1/test/my-stream')).toBe('0xA3D...47DE1/test/my-stream')
        })

        it('truncates address in the middle of text', () => {
            expect(truncate('address is 0xA3D1F77ACFF0060F7213D7BF3C7fEC78DF847DE1 inside text'))
                .toBe('address is 0xA3D...47DE1 inside text')
        })

        it('truncates paths with mutiple eth address', () => {
            expect(truncate('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1/test/0x13581255eE2D20e780B0cD3D07fac018241B5E03/path'))
                .toBe('0xa3d...47De1/test/0x135...B5E03/path')
        })

        it('only truncates valid eth addresses', () => {
            expect(truncate('0xa3d1F77ACfF3c7fEC78df847De1/test/my-stream')).toBe('0xa3d1F77ACfF3c7fEC78df847De1/test/my-stream')
        })

        it('truncates single eth address', () => {
            expect(truncate('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1')).toBe('0xa3d...47De1')
            expect(truncate('0xA3D1F77ACFF0060F7213D7BF3C7fEC78DF847DE1')).toBe('0xA3D...47DE1')
        })

        it('truncates transaction hash', () => {
            expect(truncate('0x8b549d1526d0f6168eed061041d6cb5243c2c283b6d35cf41fe9c95b1e606ff1'))
                .toBe('0x8b5...06ff1')
        })
    })

    describe('numberToText', () => {
        it('returns negative number untranslated', () => {
            expect(numberToText(-12)).toBe('-12')
        })

        it('translates round numbers', () => {
            expect(numberToText(0)).toBe('zero')
            expect(numberToText(1)).toBe('one')
            expect(numberToText(2)).toBe('two')
            expect(numberToText(3)).toBe('three')
            expect(numberToText(4)).toBe('four')
            expect(numberToText(5)).toBe('five')
            expect(numberToText(6)).toBe('six')
            expect(numberToText(7)).toBe('seven')
            expect(numberToText(8)).toBe('eight')
            expect(numberToText(9)).toBe('nine')
            expect(numberToText(10)).toBe('ten')
            expect(numberToText(100)).toBe('a hundred')
            expect(numberToText(1000)).toBe('a thousand')
            expect(numberToText(10000)).toBe('ten thousand')
            expect(numberToText(100000)).toBe('a hundred thousand')
            expect(numberToText(1000000)).toBe('a million')
        })

        it('doesnt translate specific numbers', () => {
            expect(numberToText(12)).toBe('12')
            expect(numberToText(111)).toBe('111')
            expect(numberToText(1012)).toBe('1012')
            expect(numberToText(65231)).toBe('65231')
        })
    })
})
