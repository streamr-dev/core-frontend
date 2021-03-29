import { normalize } from 'normalizr'

import mockStore from '$testUtils/mockStoreProvider'
import * as actions from '$mp/modules/myPurchaseList/actions'
import * as constants from '$mp/modules/myPurchaseList/constants'
import * as entityConstants from '$shared/modules/entities/constants'
import * as services from '$mp/modules/myPurchaseList/services'
import { subscriptionsSchema } from '$shared/modules/entities/schema'

describe('myPurchaseList - actions', () => {
    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('getMyPurchases', () => {
        it('gets my purchases', async () => {
            const productId = '1234abc'
            const product = {
                id: productId,
                name: 'Test product',
            }
            const subscriptions = [
                {
                    id: product.id,
                    user: 'test-user-1',
                    endsAt: '2010-10-10T10:10:10Z',
                    product,
                },
            ]
            const { result, entities } = normalize(subscriptions, subscriptionsSchema)

            jest.spyOn(services, 'getMyPurchases').mockImplementation(() => Promise.resolve(subscriptions))

            const store = mockStore({
                entities: {
                    products: {
                        [productId]: product,
                    },
                },
            })

            await store.dispatch(actions.getMyPurchases())

            const expectedActions = [
                {
                    type: constants.GET_MY_PURCHASES_REQUEST,
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_MY_PURCHASES_SUCCESS,
                    payload: {
                        subscriptions: result,
                    },
                },
            ]
            const resultActions = store.getActions()
            expect(resultActions).toStrictEqual(expectedActions)
        })
    })
})
