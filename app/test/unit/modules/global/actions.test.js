import mockStore from '$testUtils/mockStoreProvider'
import * as actions from '$mp/modules/global/actions'
import * as constants from '$mp/modules/global/constants'
import * as services from '$mp/modules/global/services'

describe('global - actions', () => {
    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('getDataPerUsd', () => {
        it('calls services.getDataPerUsd and sets the rate', async () => {
            const dataPerUsd = 1
            const serviceStub = jest.spyOn(services, 'getDataPerUsd').mockImplementation(() => Promise.resolve(dataPerUsd))

            const store = mockStore()
            await store.dispatch(actions.getDataPerUsd())

            const expectedActions = [
                {
                    type: constants.GET_DATA_USD_RATE_REQUEST,
                },
                {
                    type: constants.GET_DATA_USD_RATE_SUCCESS,
                    payload: {
                        dataPerUsd,
                    },
                },
            ]
            expect(store.getActions()).toStrictEqual(expectedActions)
            expect(serviceStub).toHaveBeenCalledTimes(1)
        })

        it('calls services.getDataPerUsd and handles error', async () => {
            const errorMessage = 'error'
            const serviceStub = jest.spyOn(services, 'getDataPerUsd').mockImplementation(() => Promise.reject(new Error(errorMessage)))

            const store = mockStore()
            await store.dispatch(actions.getDataPerUsd())

            const expectedActions = [
                {
                    type: constants.GET_DATA_USD_RATE_REQUEST,
                },
                {
                    type: constants.GET_DATA_USD_RATE_FAILURE,
                    payload: {
                        error: {
                            message: errorMessage,
                        },
                    },
                },
            ]
            expect(store.getActions()).toStrictEqual(expectedActions)
            expect(serviceStub).toHaveBeenCalledTimes(1)
        })
    })
})
