import { getProductLink } from '$shared/components/Tile'

describe('getProductLink', () => {
    let oldMpContractFlag

    beforeEach(() => {
        oldMpContractFlag = process.env.NEW_MP_CONTRACT
    })

    afterEach(() => {
        process.env.NEW_MP_CONTRACT = oldMpContractFlag
    })

    it('returns new editor link when NEW_MP_CONTRACT is defined', () => {
        process.env.NEW_MP_CONTRACT = 'on'
        expect(getProductLink('product123')).toBe('/core/products/product123/edit')
    })

    it('returns deprecated editor link when NEW_MP_CONTRACT is not defined', () => {
        delete process.env.NEW_MP_CONTRACT
        expect(getProductLink('product123')).toBe('/marketplace/products/product123')
    })
})
