import { normalize } from 'normalizr'
import * as selectors from '$mp/modules/contractProduct/selectors'
import { contractProductSchema } from '$shared/modules/entities/schema'
import { ContractProductState } from '$mp/types/store-state'
describe('contractProduct - selectors', () => {
    const contractProduct: ContractProductState = {
        id: 'test',
        fetchingContractProduct: true,
        contractProductError: new Error('test error'),
        whitelistedAddresses: []
    }
    const normalized = normalize(contractProduct, contractProductSchema)
    const state: any = {
        test: true,
        contractProduct,
        otherData: 42,
        entities: normalized.entities,
    }
    it('selects fetchingContractProduct', () => {
        expect(selectors.selectFetchingContractProduct(state)).toStrictEqual(contractProduct.fetchingContractProduct)
    })
    it('selects contractProductError', () => {
        expect(selectors.selectContractProductError(state)).toStrictEqual(contractProduct.contractProductError)
    })
    it('selects contractProductId', () => {
        expect(selectors.selectContractProductId(state)).toStrictEqual(contractProduct.id)
    })
    it('selects contractProduct', () => {
        expect(selectors.selectContractProduct(state)).toStrictEqual(contractProduct)
    })
})
