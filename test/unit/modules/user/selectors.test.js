import assert from 'assert-diff'
import BN from 'bignumber.js'

import * as all from '../../../../src/modules/user/selectors'

const state = {
    test: true,
    user: {
        user: {
            name: 'Tester1',
            username: 'tester1@streamr.com',
            timezone: 'Zulu',
        },
        fetchingUserData: false,
        userDataError: null,
        apiKey: {
            id: 'testid',
            name: 'Default',
            user: 'tester1@streamr.com',
        },
        fetchingApiKey: false,
        apiKeyError: null,
        web3Accounts: [
            {
                address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                name: 'test1',
            },
            {
                address: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
                name: 'test2',
            },
        ],
        fetchingWeb3Accounts: false,
        web3AccountsError: null,
        productPermissions: {
            read: true,
            write: true,
            share: true,
            fetchingPermissions: false,
            permissionsError: null,
        },
        fetchingExternalLogin: false,
    },
    otherData: 42,
    product: {
        id: 1,
    },
    web3: {
        accountId: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
        enabled: true,
    },
    entities: {
        products: {
            '1': {
                id: 1,
                isFree: true,
                pricePerSecond: BN(0),
            },
            '2': {
                id: 2,
                isFree: false,
                pricePerSecond: BN(200000000),
                ownerAddress: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
            },
            '3': {
                id: 3,
                isFree: false,
                pricePerSecond: BN(200000000),
                ownerAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
            },
        },
    },
}

describe('user - selectors', () => {
    it('selects apiKey fetching status', () => {
        assert.deepStrictEqual(all.selectFetchingApiKey(state), false)
    })

    it('selects apiKey', () => {
        assert.deepStrictEqual(all.selectApiKey(state), state.user.apiKey)
    })

    it('selects user data fetching status', () => {
        assert.deepStrictEqual(all.selectFetchingUserData(state), false)
    })

    it('selects user data', () => {
        assert.deepStrictEqual(all.selectUserData(state), state.user.user)
    })

    it('selects web3 accounts fetching status', () => {
        assert.deepStrictEqual(all.selectFetchingWeb3Accounts(state), false)
    })

    it('selects web3 accounts', () => {
        assert.deepStrictEqual(all.selectWeb3Accounts(state), state.user.web3Accounts)
    })

    it('selects permission fetching status', () => {
        assert.deepStrictEqual(all.selectFetchingProductSharePermission(state), false)
    })

    it('selects share permission', () => {
        assert.deepStrictEqual(all.selectProductSharePermission(state), true)
    })

    it('selects edit permission', () => {
        assert.deepStrictEqual(all.selectProductEditPermission(state), true)
    })

    it('selects publish permission when product is free', () => {
        assert.deepStrictEqual(all.selectProductPublishPermission(state), true)
    })

    it('selects publish permission when product is paid and owned', () => {
        const nextState = {
            ...state,
            product: {
                id: 2,
            },
        }

        assert.deepStrictEqual(all.selectProductPublishPermission(nextState), true)
    })

    it('selects publish permission when product is paid and not owned', () => {
        const nextState = {
            ...state,
            product: {
                id: 3,
            },
        }

        assert.deepStrictEqual(all.selectProductPublishPermission(nextState), false)
    })

    it('selects external login fetcing status', () => {
        assert.deepStrictEqual(all.selectFetchingExternalLogin(state), false)
    })
})
