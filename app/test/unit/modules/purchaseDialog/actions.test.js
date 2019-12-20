import assert from 'assert-diff'
import sinon from 'sinon'
import BN from 'bignumber.js'

import * as constants from '$mp/modules/deprecated/purchaseDialog/constants'
import * as selectors from '$mp/modules/deprecated/purchaseDialog/selectors'
import * as allowanceActions from '$mp/modules/allowance/actions'
import * as purchaseActions from '$mp/modules/purchase/actions'
import * as purchaseDialogActions from '$mp/modules/deprecated/purchaseDialog/actions'
import * as allowanceSelectors from '$mp/modules/allowance/selectors'
import * as contractProductSelectors from '$mp/modules/contractProduct/selectors'
import * as globalSelectors from '$mp/modules/global/selectors'
import * as web3Utils from '$mp/utils/web3'
import { dataForTimeUnits } from '$mp/utils/price'
import { gasLimits } from '$shared/utils/constants'
import { fromAtto } from '$mp/utils/math'

import mockStore from '$testUtils/mockStoreProvider'

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

        it('sets the access period when existing DATA allowance is zero and pricePerSecond is in DATA', async () => {
            const time = '1'
            const timeUnit = 'day'
            const allowance = '0'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '1'
            const dataBalance = 10000000
            const ethBalance = 10000000
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
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))
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
                        step: 'dataAllowance',
                        params: undefined,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the access period when existing DATA allowance is non-zero and pricePerSecond is in DATA', async () => {
            const time = '1'
            const timeUnit = 'day'
            const allowance = '1000'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '1'
            const dataBalance = 10000000
            const ethBalance = 10000000
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
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))
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
                        step: 'resetDataAllowance',
                        params: undefined,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the access period when existing DATA allowance is non-zero and pricePerSecond is in USD', async () => {
            const time = '1'
            const timeUnit = 'hour'
            const allowance = '1000'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '10'
            const dataBalance = 10000000
            const ethBalance = 10000000
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
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))
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
                    type: constants.SET_STEP,
                    payload: {
                        step: 'resetDataAllowance',
                        params: undefined,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the access period and moves to summary when existing DATA allowance is sufficient and pricePerSecond is in DATA', async () => {
            const time = '1'
            const timeUnit = 'day'
            const allowance = '100000000000000000000'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '1'
            const dataBalance = 10000000
            const ethBalance = 10000000
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
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))
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
                        step: 'summary',
                        params: undefined,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the access period and moves to summary when existing DATA allowance is sufficient and pricePerSecond is in USD', async () => {
            const time = '1'
            const timeUnit = 'hour'
            const allowance = '100000000000000000000'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '10'
            const dataBalance = 10000000
            const ethBalance = 10000000
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
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))
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
                    type: constants.SET_STEP,
                    payload: {
                        step: 'summary',
                        params: undefined,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the access period and moves to noBalance when existing DATA allowance is sufficient but there is not enough DATA balance', async () => {
            const time = '1'
            const timeUnit = 'day'
            const allowance = '100000000000000000000'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '1'
            const dataBalance = 10
            const ethBalance = 10000000
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
            const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, time, timeUnit)

            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))
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
                        step: 'noBalance',
                        params: {
                            requiredEthBalance: BN(fromAtto(gasLimits.BUY_PRODUCT)),
                            currentEthBalance: BN(ethBalance),
                            requiredDataBalance: BN(price),
                            currentDataBalance: BN(dataBalance),
                        },
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the access period and moves to noBalance when existing DATA allowance is sufficient but there is not enough ETH balance', async () => {
            const time = '1'
            const timeUnit = 'day'
            const allowance = '100000000000000000000'
            const store = mockStore()
            const productId = '1337'
            const dataPerUsd = '1'
            const dataBalance = 10000000
            const ethBalance = 0
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
            const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, time, timeUnit)

            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))
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
                        step: 'noBalance',
                        params: {
                            requiredEthBalance: BN(fromAtto(gasLimits.BUY_PRODUCT)),
                            currentEthBalance: BN(ethBalance),
                            requiredDataBalance: BN(price),
                            currentDataBalance: BN(dataBalance),
                        },
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('setDataAllowance', () => {
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
                await store.dispatch(purchaseDialogActions.setDataAllowance())
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
                await store.dispatch(purchaseDialogActions.setDataAllowance())
            } catch (e) {
                assert.equal('noProductOrAccess', e.message)
                done()
            }
        })

        it('moves to noBalance if there is no ETH balance', async () => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
            const allowance = '0'
            const productId = '1337'
            const dataPerUsd = '1'
            const dataBalance = 1000000
            const ethBalance = 0
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
            const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, time, timeUnit)
            const store = mockStore()

            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => purchaseData)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))

            sandbox.stub(allowanceActions, 'setDataAllowance')
                .callsFake(() => ({
                    type: 'TEST_SET_DATA_ALLOWANCE',
                    payload: {
                        dataAllowance: allowance,
                    },
                }))

            await store.dispatch(purchaseDialogActions.setDataAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: 'noBalance',
                        params: {
                            requiredEthBalance: BN(fromAtto(gasLimits.BUY_PRODUCT)),
                            currentEthBalance: BN(ethBalance),
                            requiredDataBalance: BN(price),
                            currentDataBalance: BN(dataBalance),
                        },
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('moves to noBalance if there is no DATA balance', async () => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
            const allowance = '0'
            const productId = '1337'
            const dataPerUsd = '1'
            const dataBalance = 0
            const ethBalance = 1000000
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
            const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, time, timeUnit)
            const store = mockStore()

            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => purchaseData)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))

            sandbox.stub(allowanceActions, 'setDataAllowance')
                .callsFake(() => ({
                    type: 'TEST_SET_DATA_ALLOWANCE',
                    payload: {
                        dataAllowance: allowance,
                    },
                }))

            await store.dispatch(purchaseDialogActions.setAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: 'noBalance',
                        params: {
                            requiredEthBalance: BN(fromAtto(gasLimits.BUY_PRODUCT)),
                            currentEthBalance: BN(ethBalance),
                            requiredDataBalance: BN(price),
                            currentDataBalance: BN(dataBalance),
                        },
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the DATA allowance when existing DATA allowance is zero and pricePerSecond is in DATA', async () => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
            const allowance = '0'
            const productId = '1337'
            const dataPerUsd = '1'
            const dataBalance = 10000000
            const ethBalance = 10000000
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
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))

            sandbox.stub(allowanceActions, 'setDataAllowance')
                .callsFake(() => ({
                    type: 'TEST_SET_DATA_ALLOWANCE',
                    payload: {
                        dataAllowance: allowance,
                    },
                }))

            await store.dispatch(purchaseDialogActions.setDataAllowance(allowance))

            const expectedActions = [
                {
                    type: 'TEST_SET_DATA_ALLOWANCE',
                    payload: {
                        allowance: '0',
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('sets the DATA allowance when exisiting DATA allowance is non-zero and pricePerSecond is in DATA', async () => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
            const allowance = '1000'
            const newAllowance = '1036800'
            const productId = '1337'
            const dataPerUsd = '1'
            const dataBalance = 10000000
            const ethBalance = 10000000

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
            sandbox.stub(allowanceSelectors, 'selectDataAllowanceOrPendingDataAllowance').callsFake(() => allowance)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))

            sandbox.stub(allowanceActions, 'setDataAllowance')
                .callsFake(() => ({
                    type: 'TEST_SET_DATA_ALLOWANCE',
                    payload: {
                        allowance: newAllowance.toString(),
                    },
                }))
            sandbox.stub(allowanceActions, 'resetDataAllowance')
                .callsFake(() => ({
                    type: 'TEST_RESET_DATA_ALLOWANCE',
                }))

            await store.dispatch(purchaseDialogActions.setDataAllowance(allowance))

            const expectedActions = [
                {
                    type: 'TEST_RESET_DATA_ALLOWANCE',
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
            const dataPerUsd = 1
            const dataBalance = 10000000
            const ethBalance = 10000000

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

            const store = mockStore({})
            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => purchaseData)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))

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

        it('moves to noBalance if ETH balance is not sufficient', async () => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
            const productId = '1337'
            const dataPerUsd = 1
            const dataBalance = 1000000
            const ethBalance = 0

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
            const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, time, timeUnit)

            const store = mockStore({})
            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => purchaseData)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))

            await store.dispatch(purchaseDialogActions.approvePurchase())

            const expectedActions = [
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: 'noBalance',
                        params: {
                            requiredEthBalance: BN(fromAtto(gasLimits.BUY_PRODUCT)),
                            currentEthBalance: BN(ethBalance),
                            requiredDataBalance: BN(price),
                            currentDataBalance: BN(dataBalance),
                        },
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('moves to noBalance if DATA balance is not sufficient', async () => {
            const time = '1'
            const timeUnit = 'day'
            const purchaseData = {
                time,
                timeUnit,
            }
            const productId = '1337'
            const dataPerUsd = 1
            const dataBalance = 0
            const ethBalance = 10000000

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
            const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, time, timeUnit)

            const store = mockStore({})
            sandbox.stub(selectors, 'selectPurchaseData').callsFake(() => purchaseData)
            sandbox.stub(contractProductSelectors, 'selectContractProduct').callsFake(() => product)
            sandbox.stub(globalSelectors, 'selectDataPerUsd').callsFake(() => dataPerUsd)
            sandbox.stub(web3Utils, 'getDataTokenBalance').callsFake(() => Promise.resolve(BN(dataBalance)))
            sandbox.stub(web3Utils, 'getEthBalance').callsFake(() => Promise.resolve(BN(ethBalance)))

            await store.dispatch(purchaseDialogActions.approvePurchase())

            const expectedActions = [
                {
                    type: constants.SET_STEP,
                    payload: {
                        step: 'noBalance',
                        params: {
                            requiredEthBalance: BN(fromAtto(gasLimits.BUY_PRODUCT)),
                            currentEthBalance: BN(ethBalance),
                            requiredDataBalance: BN(price),
                            currentDataBalance: BN(dataBalance),
                        },
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
