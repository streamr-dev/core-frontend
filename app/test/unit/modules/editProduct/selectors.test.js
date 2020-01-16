import assert from 'assert-diff'
import { normalize } from 'normalizr'

import * as all from '$mp/modules/deprecated/editProduct/selectors'
import { productSchema, streamsSchema, categoriesSchema } from '$shared/modules/entities/schema'
import { transactionStates } from '$shared/utils/constants'

import { existingProduct, existingStreams, existingCategory, existingCategories } from './mockData'

const product = normalize(existingProduct, productSchema)
const streams = normalize(existingStreams, streamsSchema)
const categories = normalize(existingCategories, categoriesSchema)

const mockFile = new File(['test'], 'test.jpg', {
    type: 'image/jpeg',
})

const state = {
    test: true,
    editProduct: {
        product: existingProduct,
        sending: false,
        error: {
            message: 'Test',
            statusCode: 0,
            code: 'test',
        },
        transactionState: transactionStates.STARTED,
        uploadingImage: false,
        imageError: {
            message: 'Test',
            statusCode: 0,
            code: 'test',
        },
        imageToUpload: mockFile,
    },
    entities: {
        ...product.entities,
        ...streams.entities,
        ...categories.entities,
    },
}

describe('editProduct - selectors', () => {
    it('selects editProduct', () => {
        assert.deepStrictEqual(all.selectEditProduct(state), existingProduct)
    })

    it('selects transactionState', () => {
        assert.deepStrictEqual(all.selectTransactionState(state), transactionStates.STARTED)
    })

    it('selects streamIds', () => {
        assert.deepStrictEqual(all.selectStreamIds(state), existingProduct.streams)
    })

    it('selects streams', () => {
        assert.deepStrictEqual(all.selectStreams(state), existingStreams)
    })

    it('selects imageToUpload', () => {
        assert.deepStrictEqual(all.selectImageToUpload(state), mockFile)
    })

    it('selects product category', () => {
        assert.deepStrictEqual(all.selectCategory(state), existingCategory)
    })
})
