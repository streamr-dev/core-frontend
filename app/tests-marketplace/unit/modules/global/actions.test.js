import assert from 'assert-diff'
import sinon from 'sinon'

import mockStore from '../../../test-utils/mockStoreProvider'
import * as actions from '../../../../src/modules/global/actions'
import * as constants from '../../../../src/modules/global/constants'
import * as services from '../../../../src/modules/global/services'

describe('global - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getDataPerUsd', () => {
        it('calls services.getDataPerUsd and sets the rate', async () => {
            const dataPerUsd = 1
            const serviceStub = sandbox.stub(services, 'getDataPerUsd').callsFake(() => Promise.resolve(dataPerUsd))

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
            assert.deepStrictEqual(store.getActions(), expectedActions)
            assert(serviceStub.calledOnce)
        })

        it('calls services.getDataPerUsd and handles error', async () => {
            const errorMessage = 'error'
            const serviceStub = sandbox.stub(services, 'getDataPerUsd').callsFake(() => Promise.reject(new Error(errorMessage)))

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
            assert.deepStrictEqual(store.getActions(), expectedActions)
            assert(serviceStub.calledOnce)
        })
    })

    describe('checkEthereumNetwork', () => {
        it('calls services.checkEthereumNetworkIsCorrect', async () => {
            const serviceStub = sandbox.stub(services, 'checkEthereumNetworkIsCorrect').callsFake(() => Promise.resolve())

            const store = mockStore()
            await store.dispatch(actions.checkEthereumNetwork())

            const expectedActions = [
                {
                    type: constants.CHECK_ETHEREUM_NETWORK_REQUEST,
                },
                {
                    type: constants.CHECK_ETHEREUM_NETWORK_SUCCESS,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
            assert(serviceStub.calledOnce)
        })

        it('calls services.checkEthereumNetworkIsCorrect and handles error', async () => {
            const errorMessage = 'error'
            const serviceStub = sandbox.stub(services, 'checkEthereumNetworkIsCorrect').callsFake(() => Promise.reject(new Error(errorMessage)))

            const store = mockStore()
            await store.dispatch(actions.checkEthereumNetwork())

            const expectedActions = [
                {
                    type: constants.CHECK_ETHEREUM_NETWORK_REQUEST,
                },
                {
                    type: constants.CHECK_ETHEREUM_NETWORK_FAILURE,
                    payload: {
                        error: {
                            message: errorMessage,
                        },
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
            assert(serviceStub.calledOnce)
        })
    })
})
