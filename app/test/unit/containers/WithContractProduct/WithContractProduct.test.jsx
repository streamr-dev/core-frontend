import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { withContractProduct } from '$mp/containers/WithContractProduct'
import mockStore from '$testUtils/mockStoreProvider'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import UnlockWalletDialog from '$mp/components/Modal/UnlockWalletDialog'

/* eslint-disable-next-line react/prefer-stateless-function */
class EmptyComponent extends React.Component {
    render() {
        return (
            <div />
        )
    }
}

describe('WithContractProduct', () => {
    let wrapper
    let props
    let sandbox
    let store

    const product = {
        id: 'product-1',
        name: 'Test product 1',
        isFree: false,
        pricePerSecond: 100,
    }
    const contractProduct = {
        id: 'contract-product-1',
        name: 'Test contract product 1',
        ownerAddress: '0x124',
    }

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        store = {
            product: {
                id: product.id,
            },
            contractProduct: {
                id: contractProduct.id,
                fetchingContractProduct: false,
                contractProductError: null,
            },
            entities: {
                products: {
                    [product.id]: product,
                },
                contractProducts: {
                    [contractProduct.id]: contractProduct,
                },
            },
            web3: {
                accountId: '0x123',
                enabled: true,
            },
            global: {
                ethereumNetworkIsCorrect: true,
                isWeb3Injected: true,
            },
        }
        props = {
            store: mockStore(store),
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('renders the component', () => {
        const EmptyWithHOC = withContractProduct(EmptyComponent)
        wrapper = shallow(<EmptyWithHOC {...props} />)
        expect(wrapper.dive().dive().dive().find(EmptyComponent).length).toEqual(1)
    })

    it('augments the target component with right props', () => {
        const EmptyWithHOC = withContractProduct(EmptyComponent)
        const onCancel = () => {}
        wrapper = shallow(<EmptyWithHOC onCancel={onCancel} {...props} />)

        const innerComponent = wrapper.dive().dive().dive()
        expect(innerComponent.find(EmptyComponent).length).toEqual(1)
        expect(innerComponent.prop('product')).toEqual(product)
        expect(innerComponent.prop('contractProduct')).toEqual(contractProduct)
        expect(innerComponent.prop('fetchingContractProduct')).toEqual(false)
        expect(innerComponent.prop('contractProductError')).toEqual(null)
        expect(innerComponent.prop('accountId')).toEqual('0x123')
        expect(innerComponent.prop('getContractProduct')).toEqual(expect.any(Function))
        expect(innerComponent.prop('onCancel')).toEqual(onCancel)
    })

    it('shows an error dialog if product was not found', () => {
        const EmptyWithHOC = withContractProduct(EmptyComponent)

        const newProps = {
            store: mockStore({
                ...store,
                contractProduct: {
                    contractProductError: {
                        message: 'Test error message',
                    },
                },
            }),
        }

        wrapper = shallow(<EmptyWithHOC requireInContract {...newProps} />)
        const innerComponent = wrapper.dive().dive().dive()
        expect(innerComponent.find(ErrorDialog).length).toEqual(1)
        expect(innerComponent.prop('title')).toEqual('Test product 1')
        expect(innerComponent.prop('message')).toEqual('Test error message')
    })

    it('shows the unlock dialog if we are not the owner', () => {
        const EmptyWithHOC = withContractProduct(EmptyComponent)
        wrapper = shallow(<EmptyWithHOC requireOwnerIfDeployed {...props} />)

        const innerComponent = wrapper.dive().dive().dive()
        expect(innerComponent.find(UnlockWalletDialog).length).toEqual(1)
        // I18n.t will return last part of the key path if a translation was not found
        expect(innerComponent.prop('message')).toEqual('message')
    })
})
