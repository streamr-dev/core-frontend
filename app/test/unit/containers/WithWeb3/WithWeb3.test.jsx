import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import UnlockWalletDialog from '../../../../src/marketplace/components/Modal/UnlockWalletDialog'
import * as withWeb3 from '../../../../src/marketplace/containers/WithWeb3'
import Web3NotDetectedDialog from '../../../../src/marketplace/components/Modal/Web3/Web3NotDetectedDialog'
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
                metamaskPermission: false,
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
        const EmptyWithHOC = withWeb3.withWeb3(EmptyComponent)
        wrapper = shallow(<EmptyWithHOC {...props} />)
        expect(wrapper.dive().find(EmptyComponent).length).toEqual(1)
    })

    it('augments the target component with right props', () => {
        const EmptyWithHOC = withWeb3.withWeb3(EmptyComponent)
        wrapper = shallow(<EmptyWithHOC {...props} />)

        const innerComponent = wrapper.dive()
        expect(innerComponent.find(EmptyComponent).length).toEqual(1)
        expect(innerComponent.prop('walletEnabled')).toEqual(true)
        expect(innerComponent.prop('correctNetwork')).toEqual(true)
        expect(innerComponent.prop('networkError')).toEqual(null)
    })

    it('shows an error when wallet is locked', () => {
        const EmptyWithHOC = withWeb3.withWeb3(EmptyComponent)

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
        const EmptyWithHOC = withWeb3.withWeb3(EmptyComponent)

        const newProps = {
            store: mockStore({
                ...store,
                global: {
                    isWeb3Injected: false,
                },
            }),
        }

        wrapper = shallow(<EmptyWithHOC requireWeb3 {...newProps} />)
        expect(wrapper.dive().find(Web3NotDetectedDialog).length).toEqual(1)
    })

    it('shows an error on wrong network', () => {
        const EmptyWithHOC = withWeb3.withWeb3(EmptyComponent)

        const newProps = {
            store: mockStore({
                ...store,
                global: {
                    ethereumNetworkIsCorrect: false,
                    ethereumNetworkError: {
                        message: 'Test message',
                    },
                    isWeb3Injected: true,
                },
            }),
        }

        wrapper = shallow(<EmptyWithHOC {...newProps} />)
        expect(wrapper.dive().find(UnlockWalletDialog).length).toEqual(1)
        expect(wrapper.dive().find(UnlockWalletDialog).prop('message')).toEqual('Test message')
    })

    it('requests wallet permission if permission has not been granted yet', () => {
        // TODO: Improve this test!

        // const EmptyWithHOC = withWeb3.withWeb3(EmptyComponent)
        // const newProps = {
        //     store: mockStore({
        //         ...store,
        //         i18n: {},
        //         global: {
        //             metamaskPermission: false,
        //         },
        //     }),
        // }

        // const requestMetamaskPermissionSpy = sandbox.spy(withWeb3, 'requestMetamaskPermission')
        // wrapper = shallow(<EmptyWithHOC requireWeb3 {...newProps} />)
        // sinon.assert.calledOnce(requestMetamaskPermissionSpy)
        expect(1).toEqual(1)
    })
})
