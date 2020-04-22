import React from 'react'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import IdentityHandler from '../../../../components/ProfilePage/IdentityHandler'

const mockLoad = jest.fn()
const mockApiOpen = jest.fn(() => ({
    added: true,
    error: undefined,
}))
const mockRemove = jest.fn()

jest.mock('$shared/modules/integrationKey/hooks/useEthereumIdentities', () => (
    jest.fn().mockImplementation(() => ({
        load: mockLoad,
        ethereumIdentities: [{
            id: '1',
        }],
        remove: mockRemove,
        edit: jest.fn(),
    }))
))
jest.mock('$shared/hooks/useModal', () => (
    jest.fn().mockImplementation(() => ({
        api: { open: mockApiOpen },
        isOpen: false,
    }))
))
jest.mock('$shared/hooks/usePending', () => ({
    __esModule: true,
    usePending: () => ({
        wrap: async (fn) => {
            const result = await fn()

            return result
        },
        isPending: false,
    }),
}))
jest.mock('$shared/hooks/useIsMounted', () => (
    jest.fn().mockImplementation(() => () => true)
))
jest.mock('$shared/hooks/useBalances')

describe('IdentityHandler', () => {
    beforeEach(() => {
        mockLoad.mockClear()
        mockApiOpen.mockClear()
        mockRemove.mockClear()
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
        it('must open dialog to add identity', async () => {
            const el = shallow(<IdentityHandler />)

            await act(async () => {
                await el.find('Button').simulate('click')
            })

            expect(mockApiOpen).toHaveBeenCalled()
        })
    })

    describe('onDelete', () => {
        it('must call to remove identity', () => {
            const el = mount(<IdentityHandler />)

            act(() => {
                el.find('ActionsDropdown').find('button').at(2).simulate('click')
            })

            expect(mockRemove).toHaveBeenCalled()
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
