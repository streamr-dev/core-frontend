import assert from 'assert-diff'

import * as all from '../../../../src/marketplace/modules/notifications/selectors'

const state = {
    test: true,
    notifications: {
        notifications: [
            {
                id: 1,
                created: 10000101,
                title: 'Test 1',
            },
            {
                id: 2,
                created: 10000102,
                title: 'Test 2',
            },
            {
                id: 3,
                txHash: '0x123123',
            },
        ],
    },
    otherData: 42,
}

describe('notifications - selectors', () => {
    it('selects notifications', () => {
        assert.deepStrictEqual(all.selectNotifications(state), state.notifications.notifications)
    })
})
