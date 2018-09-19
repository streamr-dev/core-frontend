import assert from 'assert-diff'
import mockStore from '../../../test-utils/mockStoreProvider'

import * as actions from '../../../../src/modules/notifications/actions'
import * as constants from '../../../../src/modules/notifications/constants'
import { notificationIcons } from '../../../../src/utils/constants'

describe('notifications - actions', () => {
    let dateNowSpy
    const DATE_NOW = 1337

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => DATE_NOW)
    })

    afterAll(() => {
        dateNowSpy.mockReset()
        dateNowSpy.mockRestore()
    })

    it('shows a notification', async () => {
        const store = mockStore()
        await store.dispatch(actions.showNotification('Test Title', notificationIcons.CHECKMARK))

        const expectedActions = [
            {
                type: constants.SHOW_NOTIFICATION,
                payload: {
                    id: DATE_NOW,
                    created: DATE_NOW,
                    title: 'Test Title',
                    icon: notificationIcons.CHECKMARK,
                },
            },
        ]
        assert.deepStrictEqual(store.getActions(), expectedActions)
    })

    it('shows a transaction notification', async () => {
        const store = mockStore()
        await store.dispatch(actions.showTransactionNotification('0x123'))

        const expectedActions = [
            {
                type: constants.SHOW_NOTIFICATION,
                payload: {
                    id: DATE_NOW,
                    created: DATE_NOW,
                    txHash: '0x123',
                },
            },
        ]
        assert.deepStrictEqual(store.getActions(), expectedActions)
    })

    it('hides a notification', async () => {
        const store = mockStore()
        await store.dispatch(actions.hideNotification(123))

        const expectedActions = [
            {
                type: constants.HIDE_NOTIFICATION,
                payload: {
                    id: 123,
                },
            },
        ]
        assert.deepStrictEqual(store.getActions(), expectedActions)
    })
})
