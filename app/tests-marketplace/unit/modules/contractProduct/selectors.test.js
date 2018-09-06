import assert from 'assert-diff'
import { normalize } from 'normalizr'

import * as selectors from '../../../../src/modules/contractProduct/selectors'
import { contractProductSchema } from '../../../../src/modules/entities/schema'

describe('contractProduct - selectors', () => {
    const contractProduct = {
        id: 'test',
        fetchingContractProduct: true,
        contractProductError: new Error('test error'),
    }

    const normalized = normalize(contractProduct, contractProductSchema)

    const state = {
        test: true,
        contractProduct,
        otherData: 42,
        entities: normalized.entities,
    }

    it('selects fetchingContractProduct', () => {
        assert.deepStrictEqual(selectors.selectFetchingContractProduct(state), contractProduct.fetchingContractProduct)
    })

    it('selects contractProductError', () => {
        assert.deepStrictEqual(selectors.selectContractProductError(state), contractProduct.contractProductError)
    })

    it('selects contractProductId', () => {
        assert.deepStrictEqual(selectors.selectContractProductId(state), contractProduct.id)
    })

    it('selects contractProduct', () => {
        assert.deepStrictEqual(selectors.selectContractProduct(state), contractProduct)
    })
})
