import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import { SaveProductDialog, mapStateToProps, mapDispatchToProps } from '../../../../src/containers/EditProductPage/SaveProductDialog'
import * as updateContractProductActions from '../../../../src/modules/updateContractProduct/actions'
import * as editProductActions from '../../../../src/modules/editProduct/actions'
import * as modalActions from '../../../../src/modules/modals/actions'
import { transactionStates } from '../../../../src/utils/constants'
import SaveProductDialogComponent from '../../../../src/components/Modal/SaveProductDialog'

describe('SaveProductDialog', () => {
    let wrapper
    let props
    let sandbox

    const product = {
        id: 'product-1',
        name: 'Product 1',
        description: 'Description',
        pricePerSecond: 1000,
    }
    const contractProduct = {
        id: 'product-1',
        pricePerSecond: 1000,
        beneficiaryAddress: 'test1',
    }

    beforeEach(() => {
        sandbox = sinon.createSandbox()

        props = {
            editProduct: product,
            contractProduct: null,
            fetchingContractProduct: false,
            contractProductError: null,
            contractTransactionState: null,
            updateTransactionState: null,
            updateProduct: sandbox.spy(),
            updateContractProduct: sandbox.spy(),
            onCancel: sandbox.spy(),
            redirect: sandbox.spy(),
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('renders the component', () => {
        wrapper = shallow(<SaveProductDialog {...props} />)
        expect(wrapper.find(SaveProductDialogComponent).length).toEqual(1)
    })

    it('maps state to props', () => {
        const state = {
            editProduct: {
                product,
                transactionState: null,
            },
            contractProduct: {
                id: contractProduct.id,
                fetchingContractProduct: false,
                contractProductError: null,
            },
            updateContractProduct: {
                transactionState: null,
            },
            entities: {
                contractProducts: {
                    [contractProduct.id]: contractProduct,
                },
            },
        }

        const expectedProps = {
            editProduct: product,
            contractProduct,
            fetchingContractProduct: false,
            contractProductError: null,
            contractTransactionState: null,
            updateTransactionState: null,
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
    })

    it('maps actions to props', () => {
        const dispatchStub = sandbox.stub().callsFake((action) => action)

        const updateProductStub = sandbox.stub(editProductActions, 'updateProduct')
        const updateContractProductStub = sandbox.stub(updateContractProductActions, 'updateContractProduct')
        const hideModalStub = sandbox.stub(modalActions, 'hideModal')

        const actions = mapDispatchToProps(dispatchStub)

        actions.updateProduct()
        actions.updateContractProduct(contractProduct.id, contractProduct)
        actions.onCancel()

        expect(dispatchStub.callCount).toEqual(3)

        expect(updateProductStub.calledOnce).toEqual(true)

        expect(updateContractProductStub.calledOnce).toEqual(true)
        expect(updateContractProductStub.calledWith(contractProduct.id, contractProduct)).toEqual(true)

        expect(hideModalStub.calledOnce).toEqual(true)
    })

    it('calls startTransaction() on mount', () => {
        const startTransactionSpy = sandbox.spy(SaveProductDialog.prototype, 'startTransaction')

        wrapper = shallow(<SaveProductDialog {...props} />)
        expect(startTransactionSpy.calledOnce).toEqual(true)
    })

    it('calls startTransaction() when receiving props', () => {
        const startTransactionSpy = sandbox.spy(SaveProductDialog.prototype, 'startTransaction')

        wrapper = shallow(<SaveProductDialog {...props} />)
        wrapper.setProps({
            ...props,
            editProduct: null,
        })
        expect(startTransactionSpy.calledTwice).toEqual(true)
    })

    it('updates paid product name and description', (done) => {
        const nextProps = {
            ...props,
            editProduct: product,
        }

        wrapper = shallow(<SaveProductDialog {...nextProps} />)
        expect(props.updateProduct.calledOnce).toEqual(true)

        wrapper.setProps({
            ...nextProps,
            updateTransactionState: transactionStates.CONFIRMED,
        })

        setTimeout(() => {
            expect(props.redirect.calledOnce).toEqual(true)
            expect(props.redirect.calledWith(product.id)).toEqual(true)
            done()
        }, 2000)
    })

    it('updates contract product if price changes', (done) => {
        const paidProduct = {
            ...product,
            pricePerSecond: 2000,
        }
        const nextProps = {
            ...props,
            editProduct: paidProduct,
            contractProduct,
        }

        wrapper = shallow(<SaveProductDialog {...nextProps} />)
        expect(props.updateContractProduct.calledOnce).toEqual(true)

        wrapper.setProps({
            ...nextProps,
            contractTransactionState: transactionStates.CONFIRMED,
        })

        setTimeout(() => {
            expect(props.redirect.calledOnce).toEqual(true)
            expect(props.redirect.calledWith(paidProduct.id)).toEqual(true)
            done()
        }, 2000)
    })

    it('updates contract product if beneficiary address changes', (done) => {
        const paidProduct = {
            ...product,
            beneficiaryAddress: 'test2',
        }
        const nextProps = {
            ...props,
            editProduct: paidProduct,
            contractProduct,
        }

        wrapper = shallow(<SaveProductDialog {...nextProps} />)
        expect(props.updateContractProduct.calledOnce).toEqual(true)

        wrapper.setProps({
            ...nextProps,
            contractTransactionState: transactionStates.CONFIRMED,
        })

        setTimeout(() => {
            expect(props.redirect.calledOnce).toEqual(true)
            expect(props.redirect.calledWith(paidProduct.id)).toEqual(true)
            done()
        }, 2000)
    })
})
