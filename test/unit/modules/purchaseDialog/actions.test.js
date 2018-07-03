import assert from 'assert-diff'
import sinon from 'sinon'

import * as constants from '../../../../src/modules/purchaseDialog/constants'
import * as selectors from '../../../../src/modules/purchaseDialog/selectors'
import * as allowanceActions from '../../../../src/modules/allowance/actions'
import * as purchaseActions from '../../../../src/modules/purchase/actions'
import * as purchaseDialogActions from '../../../../src/modules/purchaseDialog/actions'
import * as allowanceSelectors from '../../../../src/modules/allowance/selectors'

import mockStore from '../../../test-utils/mockStoreProvider'

describe('purchaseDialog - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('initPurchase', () => {
        it('produces a correct-looking object', () => {
            const id = 'test'
            assert.deepStrictEqual(purchaseDialogActions.initPurchase(id), {
                type: constants.INIT_PURCHASE,
                payload: {
                    id,
                },
            })
        })
    })

    it('sets the access period', async () => {
        const time = '1'
        const timeUnit = 'day'
        const allowance = '1000'
        const pendingAllowance = '2000'
        const store = mockStore()
        const productId = '1337'
        const product = {
            key: 'asd-123',
            id: productId,
            name: 'Product 1',
            description: 'Description 1',
            owner: 'Owner Name',
            category: 'cat-1',
            minimumSubscriptionInSeconds: 1,
            ownerAddress: '0x123',
            beneficiaryAddress: '0x456',
            pricePerSecond: '12',
            priceCurrency: 'DATA',
            state: 'DEPLOYED',
        }

        sandbox.stub(selectors, 'selectProduct').callsFake(() => product)
        sandbox.stub(allowanceSelectors, 'selectAllowance').callsFake(() => allowance)
        sandbox.stub(allowanceSelectors, 'selectPendingAllowance').callsFake(() => pendingAllowance)
        await store.dispatch(purchaseDialogActions.setAccessPeriod(time, timeUnit))

        const expectedActions = [
            {
                type: constants.SET_ACCESS_PERIOD,
                payload: {
                    time: '1',
                    timeUnit: 'day',
                },
            },
            {
                type: constants.SET_STEP,
                payload: {
                    step: 'allowance',
                },
            },
        ]

        assert.deepStrictEqual(store.getActions(), expectedActions)
    })

    it('sets the allowance', async () => {
        const time = '1'
        const timeUnit = 'day'
        const purchaseData = {
            time,
            timeUnit,
        }
        const allowance = '1000'
        const productId = '1337'

        const product = {
            key: 'asd-123',
            id: productId,
            name: 'Product 1',
            description: 'Description 1',
            owner: 'Owner Name',
            category: 'cat-1',
            minimumSubscriptionInSeconds: 1,
            ownerAddress: '0x123',
            beneficiaryAddress: '0x456',
            pricePerSecond: '12',
            priceCurrency: 'DATA',
            state: 'DEPLOYED',
        }

        const store = mockStore({
            product,
            entities: {
                products: {
                    [productId]: {
                        id: productId,
                        name: 'Test product',
                        pricePerSecond: 123,
                        isFree: false,
                    },
                },
            },
            allowance: {
                allowance,
            },
            purchaseDialog: {
                productId,
                data: purchaseData,
            },
        })

        sandbox.stub(allowanceActions, 'setAllowance')
            .callsFake(() => ({
                type: 'TEST_SET_ALLOWANCE',
                payload: {
                    allowance,
                },
            }))

        await store.dispatch(allowanceActions.setAllowance(allowance))

        const expectedActions = [
            {
                type: 'TEST_SET_ALLOWANCE',
                payload: {
                    allowance: '1000',
                },
            },
        ]

        assert.deepStrictEqual(store.getActions(), expectedActions)
    })

    it('it approves the purchase', async () => {
        const time = '1'
        const timeUnit = 'day'
        const purchaseData = {
            time,
            timeUnit,
        }
        const allowance = '1000'
        const productId = '1337'

        const product = {
            key: 'asd-123',
            id: productId,
            name: 'Product 1',
            description: 'Description 1',
            owner: 'Owner Name',
            category: 'cat-1',
            minimumSubscriptionInSeconds: 10000,
            ownerAddress: '0x123',
            beneficiaryAddress: '0x456',
            pricePerSecond: '12',
            priceCurrency: 'DATA',
        }

        const store = mockStore({
            product,
            entities: {
                products: {
                    [productId]: {
                        id: productId,
                        name: 'Test product',
                        pricePerSecond: 123,
                        isFree: false,
                    },
                },
            },
            allowance: {
                allowance,
            },
            purchaseDialog: {
                productId,
                data: purchaseData,
            },
        })

        sandbox.stub(purchaseActions, 'buyProduct')
            .callsFake(() => ({
                type: 'TEST_BUY_PRODUCT',
                payload: {
                    productId,
                    subscriptionInSeconds: '86400',
                },
            }))

        await store.dispatch(purchaseDialogActions.approvePurchase())

        const expectedActions = [
            {
                type: 'TEST_BUY_PRODUCT',
                payload: {
                    productId: product.id,
                    subscriptionInSeconds: '86400',
                },
            },
        ]

        assert.deepStrictEqual(store.getActions(), expectedActions)
    })
})
