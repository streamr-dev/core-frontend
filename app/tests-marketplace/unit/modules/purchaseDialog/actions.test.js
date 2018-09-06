import assert from 'assert-diff'
import sinon from 'sinon'

import * as constants from '../../../../src/modules/purchaseDialog/constants'
import * as selectors from '../../../../src/modules/purchaseDialog/selectors'
import * as allowanceActions from '../../../../src/modules/allowance/actions'
import * as purchaseActions from '../../../../src/modules/purchase/actions'
import * as purchaseDialogActions from '../../../../src/modules/purchaseDialog/actions'
import * as allowanceSelectors from '../../../../src/modules/allowance/selectors'
import * as contractProductSelectors from '../../../../src/modules/contractProduct/selectors'
import * as globalSelectors from '../../../../src/modules/global/selectors'
import * as priceUtils from '../../../../src/utils/price'

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

    describe('setAccessPeriod', () => {
        it('throws an error if product is not defined', async (done) => {
            sandbox.stub().callsFake((action) => action)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => null)

            const time = '1'
            const timeUnit = 'day'
            const store = mockStore()

            try {
                await store.dispatch(purchaseDialogActions.setAccessPeriod(time, timeUnit))
            } catch (e) {
                assert.equal('noProduct', e.message)
                done()
            }
        })

        it('sets the access period when existing allowance is zero and pricePerSecond is in DATA', async () => {
            const time = '1'
            const timeUnit = 'day'
            const allowance = '0'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '1'
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

            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectAllowanceOrPendingAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
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
                    type: constants.RESET_REPLACED_ALLOWANCE,
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

        it('sets the access period when existing allowance is non-zero and pricePerSecond is in DATA', async () => {
            const time = '1'
            const timeUnit = 'day'
            const allowance = '1000'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '1'
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

            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectAllowanceOrPendingAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
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
                    type: constants.RESET_REPLACED_ALLOWANCE,
                },
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: 'resetAllowance',
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the access period when existing allowance is non-zero and pricePerSecond is in USD', async () => {
            const time = '1'
            const timeUnit = 'hour'
            const allowance = '1000'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '10'
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
                priceCurrency: 'USD',
                state: 'DEPLOYED',
            }

            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectAllowanceOrPendingAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            await store.dispatch(purchaseDialogActions.setAccessPeriod(time, timeUnit))

            const expectedActions = [
                {
                    type: constants.SET_ACCESS_PERIOD,
                    payload: {
                        time: '1',
                        timeUnit: 'hour',
                    },
                },
                {
                    type: constants.RESET_REPLACED_ALLOWANCE,
                },
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: 'resetAllowance',
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the access period and moves to summary when existing allowance is sufficient and pricePerSecond is in DATA', async () => {
            const time = '1'
            const timeUnit = 'day'
            const allowance = '100000000000000000000'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '1'
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

            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectAllowanceOrPendingAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
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
                    type: constants.RESET_REPLACED_ALLOWANCE,
                },
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: 'summary',
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the access period and moves to summary when existing allowance is sufficient and pricePerSecond is in USD', async () => {
            const time = '1'
            const timeUnit = 'hour'
            const allowance = '100000000000000000000'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '10'
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
                priceCurrency: 'USD',
                state: 'DEPLOYED',
            }

            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectAllowanceOrPendingAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            await store.dispatch(purchaseDialogActions.setAccessPeriod(time, timeUnit))

            const expectedActions = [
                {
                    type: constants.SET_ACCESS_PERIOD,
                    payload: {
                        time: '1',
                        timeUnit: 'hour',
                    },
                },
                {
                    type: constants.RESET_REPLACED_ALLOWANCE,
                },
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: 'summary',
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('setAllowance', () => {
        it('throws an error if product is not defined', async (done) => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
            sandbox.stub().callsFake((action) => action)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => null)
            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => purchaseData)

            const store = mockStore()

            try {
                await store.dispatch(purchaseDialogActions.setAllowance())
            } catch (e) {
                assert.equal('noProductOrAccess', e.message)
                done()
            }
        })

        it('throws an error if purchase is not defined', async (done) => {
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
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => null)

            const store = mockStore()

            try {
                await store.dispatch(purchaseDialogActions.setAllowance())
            } catch (e) {
                assert.equal('noProductOrAccess', e.message)
                done()
            }
        })

        it('sets the allowance when exisiting allowance is zero and pricePerSecond is in DATA', async () => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
            const allowance = '0'
            const productId = '1337'
            const dataPerUsd = '1'
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
            const store = mockStore()

            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => purchaseData)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectAllowanceOrPendingAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)

            sandbox.stub(allowanceActions, 'setAllowance')
                .callsFake(() => ({
                    type: 'TEST_SET_ALLOWANCE',
                    payload: {
                        allowance,
                    },
                }))

            await store.dispatch(purchaseDialogActions.setAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.RESET_REPLACED_ALLOWANCE,
                },
                {
                    type: 'TEST_SET_ALLOWANCE',
                    payload: {
                        allowance: '0',
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the allowance when exisiting allowance is non-zero and pricePerSecond is in DATA', async () => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
            const allowance = '1000'
            const newAllowance = '2000'
            const productId = '1337'
            const dataPerUsd = '1'

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
            const store = mockStore()

            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => purchaseData)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectAllowanceOrPendingAllowance').callsFake(() => allowance)
            sandbox.stub(priceUtils, 'dataForTimeUnits').callsFake(() => newAllowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)

            sandbox.stub(allowanceActions, 'setAllowance')
                .callsFake(() => ({
                    type: 'TEST_SET_ALLOWANCE',
                    payload: {
                        allowance: newAllowance,
                    },
                }))

            await store.dispatch(purchaseDialogActions.setAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.REPLACE_ALLOWANCE,
                    payload: {
                        allowance: newAllowance,
                    },
                },
                {
                    type: 'TEST_SET_ALLOWANCE',
                    payload: {
                        allowance: newAllowance,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('approvePurchase', () => {
        it('throws an error if product is not defined', async (done) => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
            sandbox.stub().callsFake((action) => action)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => null)
            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => purchaseData)

            const store = mockStore()

            try {
                await store.dispatch(purchaseDialogActions.approvePurchase())
            } catch (e) {
                assert.equal('noProductOrAccess', e.message)
                done()
            }
        })

        it('throws an error if purchase is not defined', async (done) => {
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
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => null)

            const store = mockStore()

            try {
                await store.dispatch(purchaseDialogActions.approvePurchase())
            } catch (e) {
                assert.equal('noProductOrAccess', e.message)
                done()
            }
        })

        it('it approves the purchase', async () => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
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

            const store = mockStore()
            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => purchaseData)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)

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
})
