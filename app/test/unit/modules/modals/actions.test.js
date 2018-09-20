import assert from 'assert-diff'
import mockStore from '../../../test-utils/mockStoreProvider'

import * as actions from '../../../../src/marketplace/modules/modals/actions'
import * as constants from '../../../../src/marketplace/modules/modals/constants'

describe('modals - actions', () => {
    describe('showModal', () => {
        it('shows a modal', async () => {
            const store = mockStore()
            const modalParams = {
                test: true,
                param2: 42,
            }
            await store.dispatch(actions.showModal('TEST_MODAL', modalParams))

            const expectedActions = [
                {
                    type: constants.SHOW_MODAL_DIALOG,
                    payload: {
                        modalName: 'TEST_MODAL',
                        modalProps: modalParams,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('hideModal', () => {
        it('hides a modal', async () => {
            const store = mockStore()
            await store.dispatch(actions.hideModal('TEST_MODAL'))

            const expectedActions = [
                {
                    type: constants.HIDE_MODAL_DIALOG,
                    payload: 'TEST_MODAL',
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
