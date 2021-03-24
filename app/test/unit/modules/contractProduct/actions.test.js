import { normalize } from 'normalizr'
import mockStore from '$testUtils/mockStoreProvider'

import * as actions from '$mp/modules/contractProduct/actions'
import * as constants from '$mp/modules/contractProduct/constants'
import * as entityConstants from '$shared/modules/entities/constants'
import * as services from '$mp/modules/contractProduct/services'
import { contractProductSchema } from '$shared/modules/entities/schema'

describe('contractProduct - actions', () => {
    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('getProductFromContract', () => {
        it('gets contractProduct successfully', async () => {
            const store = mockStore()

            const product = {
                id: 'test',
                name: 'testName',
                description: 'testDescription',
            }
            const { result, entities } = normalize(product, contractProductSchema)

            jest.spyOn(services, 'getProductFromContract').mockImplementation((id) => Promise.resolve({
                ...product,
                id,
            }))

            await store.dispatch(actions.getProductFromContract('test'))
            const expectedActions = [
                {
                    type: constants.GET_PRODUCT_FROM_CONTRACT_REQUEST,
                    payload: {
                        id: result,
                    },
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_PRODUCT_FROM_CONTRACT_SUCCESS,
                    payload: {
                        id: result,
                    },
                },
            ]
            expect(store.getActions()).toStrictEqual(expectedActions)
        })

        it('responds to errors', async () => {
            const store = mockStore()

            jest.spyOn(services, 'getProductFromContract').mockImplementation(() => Promise.reject(new Error('test error')))
            const product = {
                id: 'test',
            }
            const { result } = normalize(product, contractProductSchema)

            await store.dispatch(actions.getProductFromContract('test'))

            const expectedActions = [
                {
                    type: constants.GET_PRODUCT_FROM_CONTRACT_REQUEST,
                    payload: {
                        id: result,
                    },
                },
                {
                    type: constants.GET_PRODUCT_FROM_CONTRACT_FAILURE,
                    payload: {
                        id: 'test',
                        error: {
                            message: 'test error',
                        },
                    },
                },
            ]
            expect(store.getActions()).toStrictEqual(expectedActions)
        })
    })

    describe('clearContractProduct', () => {
        it('clears state', async () => {
            const store = mockStore()

            await store.dispatch(actions.clearContractProduct())
            const expectedActions = [
                {
                    type: constants.CLEAR_CONTRACT_PRODUCT,
                },
            ]
            expect(store.getActions()).toStrictEqual(expectedActions)
        })
    })
})
