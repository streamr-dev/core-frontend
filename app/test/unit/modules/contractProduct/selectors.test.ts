import { normalize } from 'normalizr'
import * as selectors from '$mp/modules/contractProduct/selectors'
import { contractProductSchema } from '$shared/modules/entities/schema'
import { ContractProductState } from '$mp/types/store-state'
import { StoreState } from '$shared/types/store-state'
describe('contractProduct - selectors', () => {
    const contractProduct: ContractProductState = {
        id: 'test',
        fetchingContractProduct: true,
        contractProductError: new Error('test error'),
        whitelistedAddresses: []
    }
    const normalized = normalize(contractProduct, contractProductSchema)
    const state: Partial<StoreState> = {
        contractProduct,
        entities: normalized.entities,
    }
    it('selects fetchingContractProduct', () => {
        expect(selectors.selectFetchingContractProduct(state as StoreState)).toStrictEqual(contractProduct.fetchingContractProduct)
    })
    it('selects contractProductError', () => {
        expect(selectors.selectContractProductError(state as StoreState)).toStrictEqual(contractProduct.contractProductError)
    })
    it('selects contractProductId', () => {
        expect(selectors.selectContractProductId(state as StoreState)).toStrictEqual(contractProduct.id)
    })
    it('selects contractProduct', () => {
        expect(selectors.selectContractProduct(state as StoreState)).toStrictEqual(contractProduct)
    })
})
