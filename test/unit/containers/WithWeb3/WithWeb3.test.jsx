import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import UnlockWalletDialog from '../../../../src/components/Modal/UnlockWalletDialog'
import Web3NotDetectedDialog from '../../../../src/components/Modal/Web3/Web3NotDetectedDialog'
import { withWeb3 } from '../../../../src/containers/WithWeb3'
import mockStore from '../../../test-utils/mockStoreProvider'

/* eslint-disable */
class EmptyComponent extends React.Component {
    render() {
        return (
            <div>
            </div>
        )
    }
}
/* eslint-enable */

describe('WithWeb3', () => {
    let wrapper
    let props
    let sandbox
    let store

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        store = {
            web3: {
                accountId: '0x1',
                error: null,
                enabled: true,
            },
            global: {
                dataPerUsd: 1,
                ethereumNetworkIsCorrect: true,
                checkingNetwork: false,
                fetchingDataPerUsdRate: false,
                dataPerUsdRateError: null,
                ethereumNetworkError: null,
                isMetaMaskInUse: true,
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
        const EmptyWithHOC = withWeb3(EmptyComponent)
        wrapper = shallow(<EmptyWithHOC {...props} />)
        expect(wrapper.dive().find(EmptyComponent).length).toEqual(1)
    })

    it('augments the target component with right props', () => {
        const EmptyWithHOC = withWeb3(EmptyComponent)
        wrapper = shallow(<EmptyWithHOC {...props} />)

        const innerComponent = wrapper.dive()
        expect(innerComponent.find(EmptyComponent).length).toEqual(1)
        expect(innerComponent.prop('walletEnabled')).toEqual(true)
        expect(innerComponent.prop('correctNetwork')).toEqual(true)
        expect(innerComponent.prop('networkError')).toEqual(null)
    })

    it('shows an error when wallet is locked', () => {
        const EmptyWithHOC = withWeb3(EmptyComponent)

        const newProps = {
            store: mockStore({
                ...store,
                web3: {
                    enabled: false,
                },
            }),
        }

        wrapper = shallow(<EmptyWithHOC requireWeb3 {...newProps} />)
        expect(wrapper.dive().find(UnlockWalletDialog).length).toEqual(1)
    })

    it('shows an error when MetaMask is not available', () => {
        const EmptyWithHOC = withWeb3(EmptyComponent)

        const newProps = {
            store: mockStore({
                ...store,
                global: {
                    isMetaMaskInUse: false,
                },
            }),
        }

        wrapper = shallow(<EmptyWithHOC requireWeb3 {...newProps} />)
        expect(wrapper.dive().find(Web3NotDetectedDialog).length).toEqual(1)
    })

    it('shows an error on wrong network', () => {
        const EmptyWithHOC = withWeb3(EmptyComponent)

        const newProps = {
            store: mockStore({
                ...store,
                global: {
                    ethereumNetworkIsCorrect: false,
                    ethereumNetworkError: {
                        message: 'Test message',
                    },
                    isMetaMaskInUse: true,
                },
            }),
        }

        wrapper = shallow(<EmptyWithHOC {...newProps} />)
        expect(wrapper.dive().find(UnlockWalletDialog).length).toEqual(1)
        expect(wrapper.dive().find(UnlockWalletDialog).prop('message')).toEqual('Test message')
    })
})
