import assert from 'assert-diff'
import { normalize } from 'normalizr'
import sinon from 'sinon'
import mockStore from '$testUtils/mockStoreProvider'

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import * as actions from '$mp/modules/deprecated/editProduct/actions'
import * as constants from '$mp/modules/deprecated/editProduct/constants'
import * as entityConstants from '$shared/modules/entities/constants'
import * as services from '$mp/modules/deprecated/editProduct/services'
import { productSchema } from '$shared/modules/entities/schema'
import { formatPath } from '$shared/utils/url'
import links from '$app/src/links'
import { existingProduct } from './mockData'

describe('editProduct - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    const emptyProduct = {
        id: '',
        name: '',
        owner: '',
        description: '',
        imageUrl: '',
        thumbnailUrl: '',
        category: '',
        streams: [],
        previewStream: '',
        ownerAddress: '',
        beneficiaryAddress: '',
        pricePerSecond: '0',
        priceCurrency: 'DATA',
        previewConfigJson: '',
    }

    it('initializes new product', async () => {
        const store = mockStore()
        await store.dispatch(actions.initNewProduct())

        const expectedActions = [
            {
                type: constants.UPDATE_PRODUCT,
                payload: {
                    product: emptyProduct,
                },
            },
        ]
        const resultActions = store.getActions()

        assert.deepStrictEqual(resultActions, expectedActions)
    })

    it('initializes edit product from store', async () => {
        const { entities } = normalize(existingProduct, productSchema)
        const store = mockStore({
            product: {
                id: existingProduct.id,
            },
            entities,
        })

        await store.dispatch(actions.initEditProduct())

        const expectedActions = [
            {
                type: constants.UPDATE_PRODUCT,
                payload: {
                    product: existingProduct,
                },
            },
        ]
        const resultActions = store.getActions()
        assert.deepStrictEqual(resultActions, expectedActions)
    })

    it('uploads an image successfully', async () => {
        const { result, entities } = normalize(existingProduct, productSchema)
        const store = mockStore({
            entities,
        })
        const mockFile = new File(['test'], 'test.jpg', {
            type: 'image/jpeg',
        })

        sandbox.stub(services, 'postImage').callsFake(() => Promise.resolve(existingProduct))

        const expectedActions = [
            {
                type: constants.IMAGE_UPLOAD_REQUEST,
                payload: {
                    image: mockFile,
                },
            },
            {
                type: entityConstants.UPDATE_ENTITIES,
                payload: {
                    entities,
                },
            },
            {
                type: constants.IMAGE_UPLOAD_SUCCESS,
            },
        ]

        await store.dispatch(actions.uploadImage(result, mockFile))
        const resultActions = store.getActions()
        assert.deepStrictEqual(resultActions, expectedActions)
    })

    /**
     * Tests updateProduct, ignoring actions for uploadImage (tested above)
     */
    it('updates a product with image', async () => {
        const { entities } = normalize(existingProduct, productSchema)
        const store = mockStore({
            editProduct: {
                product: existingProduct,
                imageToUpload: {
                    preview: 'blob:http://localhost/3287d88d-1382-4b3f-9b7d-fd0a61865402',
                },
            },
            entities,
        })

        sandbox.stub(Notification, 'push')
        sandbox.stub(services, 'putProduct').callsFake(() => Promise.resolve(existingProduct))
        sandbox.stub(services, 'postImage').callsFake(() => Promise.resolve(existingProduct))

        const expectedActions = [
            {
                type: constants.PUT_PRODUCT_REQUEST,
            },
            {
                type: entityConstants.UPDATE_ENTITIES,
                payload: {
                    entities,
                },
            },
            {
                type: constants.IMAGE_UPLOAD_REQUEST,
                payload: {
                    image: {
                        preview: 'blob:http://localhost/3287d88d-1382-4b3f-9b7d-fd0a61865402',
                    },
                },
            },
            {
                type: constants.PUT_PRODUCT_SUCCESS,
            },
        ]
        await store.dispatch(actions.updateProduct())
        sinon.assert.calledWith(Notification.push, sinon.match.has('title', 'productUpdated'))
        sinon.assert.calledWith(Notification.push, sinon.match.has('icon', NotificationIcon.CHECKMARK))

        // Slice off possible actions for uploadImage, which is irrelevant in this test
        const resultActions = store.getActions().slice(0, 4)

        assert.deepStrictEqual(resultActions, expectedActions)
    })

    it('creates product and redirects', async () => {
        const { entities } = normalize(existingProduct, productSchema)
        const store = mockStore({
            editProduct: {
                product: existingProduct,
                imageToUpload: {
                    preview: 'blob:http://localhost/3287d88d-1382-4b3f-9b7d-fd0a61865402',
                },
            },
            entities,
        })

        sandbox.stub(services, 'postProduct').callsFake(() => Promise.resolve(existingProduct))
        sandbox.stub(services, 'postImage').callsFake(() => Promise.resolve(existingProduct))

        const expectedActions = [
            {
                type: constants.POST_PRODUCT_REQUEST,
            },
            {
                type: entityConstants.UPDATE_ENTITIES,
                payload: {
                    entities,
                },
            },
            {
                type: constants.POST_PRODUCT_SUCCESS,
            },
            {
                type: constants.RESET_PRODUCT,
            },
            {
                type: constants.IMAGE_UPLOAD_REQUEST,
                payload: {
                    image: {
                        preview: 'blob:http://localhost/3287d88d-1382-4b3f-9b7d-fd0a61865402',
                    },
                },
            },
            {
                type: '@@router/CALL_HISTORY_METHOD',
                payload: {
                    method: 'push',
                    args: [
                        `${links.marketplace.products}/${existingProduct.id}/publish`,
                    ],
                },
            },
        ]

        await store.dispatch(actions.createProductAndRedirect((id) => formatPath(links.marketplace.products, id, 'publish')))
        // Slice off possible actions for uploadImage, which is irrelevant in this test
        const resultActions = store.getActions().slice(0, 6)

        assert.deepStrictEqual(resultActions, expectedActions)
    })

    it('fails creating a product', async () => {
        const error = new Error('test')
        const { entities } = normalize(existingProduct, productSchema)
        const store = mockStore({
            editProduct: {
                product: existingProduct,
                imageToUpload: {
                    preview: 'blob:http://localhost/3287d88d-1382-4b3f-9b7d-fd0a61865402',
                },
            },
            entities,
        })

        sandbox.stub(services, 'postProduct').callsFake(() => Promise.reject(error))

        const expectedActions = [
            {
                type: constants.POST_PRODUCT_REQUEST,
            },
            {
                type: constants.POST_PRODUCT_FAILURE,
                error: true,
                payload: error,
            },
        ]

        await store.dispatch(actions.createProductAndRedirect((id) => formatPath('products', id, 'publish')))
        const resultActions = store.getActions()
        assert.deepStrictEqual(resultActions, expectedActions)
    })
})
