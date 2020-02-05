import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import { act } from 'react-dom/test-utils'

import IdentityHandler from '../../../../components/ProfilePage/IdentityHandler'

const mockLoad = jest.fn()
const mockApiOpen = jest.fn()

jest.mock('$shared/modules/integrationKey/hooks/useEthereumIdentities', () => (
    jest.fn().mockImplementation(() => ({
        load: mockLoad,
        ethereumIdentities: [],
        remove: jest.fn(),
        edit: jest.fn(),
    }))
))
jest.mock('$shared/hooks/useModal', () => (
    jest.fn().mockImplementation(() => ({
        api: { open: mockApiOpen },
        isOpen: false,
    }))
))
jest.mock('$shared/hooks/useIsMounted')

describe('IdentityHandler', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        mockLoad.mockClear()
        mockApiOpen.mockClear()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('componentDidMount', () => {
        it('loads integrationKeys', () => {
            act(() => {
                mount(<IdentityHandler />)
            })
            expect(mockLoad).toHaveBeenCalled()
        })
    })

    describe('onNew', () => {
        it('must open dialog to add identity', () => {
            const el = shallow(<IdentityHandler />)

            act(() => {
                el.find('Button').simulate('click')
            })

            expect(mockApiOpen).toHaveBeenCalled()
        })
    })

    describe('render', () => {
        it('should render correctly', () => {
            const handler = shallow(<IdentityHandler />)
            const handlerSegment = handler.find('IntegrationKeyList')
            expect(handlerSegment.exists()).toBe(true)
        })
    })
})
