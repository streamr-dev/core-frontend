import assert from 'assert-diff'
import mockStore from '../../../test-utils/mockStoreProvider'

import * as actions from '../../../../modules/web3/actions'
import * as constants from '../../../../modules/web3/constants'
import * as allowanceConstants from '../../../../modules/allowance/constants'

describe('web3 - actions', () => {
    describe('accountError', () => {
        it('sets error correctly', () => {
            const store = mockStore()
            store.dispatch(actions.accountError(new Error('Error')))

            const expectedActions = [
                {
                    type: constants.ACCOUNT_ERROR,
                    error: true,
                    payload: {},
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })
    })

    describe('receiveAccount', () => {
        it('receives the initial account and gets allowance', () => {
            const address = '0x13581255eE2D20e780B0cD3D07fac018241B5E03'

            const store = mockStore()
            store.dispatch(actions.receiveAccount(address))

            const expectedActions = [
                {
                    type: constants.RECEIVE_ACCOUNT,
                    payload: {
                        id: address,
                    },
                },
                {
                    type: allowanceConstants.GET_ALLOWANCE_REQUEST,
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })
    })

    describe('changeAccount', () => {
        it('receives the changed account and gets allowance', () => {
            const address = '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10'

            const store = mockStore()
            store.dispatch(actions.changeAccount(address))

            const expectedActions = [
                {
                    type: constants.CHANGE_ACCOUNT,
                    payload: {
                        id: address,
                    },
                },
                {
                    type: allowanceConstants.GET_ALLOWANCE_REQUEST,
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })
    })
})
