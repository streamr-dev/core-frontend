import assert from 'assert-diff'
import { normalize } from 'normalizr'

import * as selectors from '../../../../modules/contractProduct/selectors'
import { contractProductSchema } from '../../../../modules/entities/schema'

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
        assert.deepEqual(selectors.selectFetchingContractProduct(state), contractProduct.fetchingContractProduct)
    })

    it('selects contractProductError', () => {
        assert.deepEqual(selectors.selectContractProductError(state), contractProduct.contractProductError)
    })

    it('selects contractProductId', () => {
        assert.deepEqual(selectors.selectContractProductId(state), contractProduct.id)
    })

    it('selects contractProduct', () => {
        assert.deepEqual(selectors.selectContractProduct(state), contractProduct)
    })
})
