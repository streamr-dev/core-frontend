import getStreamPath from './getStreamPath'

describe('getStreamPath', () => {
    it('returns legacy id without domain', () => {
        const { domain, truncatedDomain, pathname, truncatedId } = getStreamPath('mystream-123')

        expect(domain).toBe(undefined)
        expect(truncatedDomain).toBe(undefined)
        expect(pathname).toBe('mystream-123')
        expect(truncatedId).toBe('mystream-123')
    })

    it('returns ENS path without truncation', () => {
        const { domain, truncatedDomain, pathname, truncatedId } = getStreamPath('streamr.eth/mystream-123')

        expect(domain).toBe('streamr.eth')
        expect(truncatedDomain).toBe('streamr.eth')
        expect(pathname).toBe('mystream-123')
        expect(truncatedId).toBe('streamr.eth/mystream-123')
    })

    it('returns ETH address path with truncation', () => {
        const { domain, truncatedDomain, pathname, truncatedId } = getStreamPath('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1/mystream-123')

        expect(domain).toBe('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1')
        expect(truncatedDomain).toBe('0xa3d...47De1')
        expect(pathname).toBe('mystream-123')
        expect(truncatedId).toBe('0xa3d...47De1/mystream-123')
    })
})
