import assert from 'assert-diff'
import BN from 'bignumber.js'

import * as all from '$shared/modules/user/selectors'

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
        ethereumIdentities: [
            {
                address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                name: 'test1',
            },
            {
                address: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
                name: 'test2',
            },
        ],
        privateKeys: [
            {
                address: '0x99781aD21621a30881Aaa21559463C38cF1A9EF9',
                name: 'test3',
            },
        ],
        fetchingIntegrationKeys: false,
        integrationKeysError: null,
        fetchingExternalLogin: false,
        logoutError: null,
        fetchingLogout: false,
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
    it('selects user data fetching status', () => {
        assert.deepStrictEqual(all.selectFetchingUserData(state), false)
    })

    it('selects user data', () => {
        assert.deepStrictEqual(all.selectUserData(state), state.user.user)
    })

    it('selects external login fetcing status', () => {
        assert.deepStrictEqual(all.selectFetchingExternalLogin(state), false)
    })

    it('selects logout error', () => {
        assert.deepStrictEqual(all.selectLogoutError(state), null)
    })
})
