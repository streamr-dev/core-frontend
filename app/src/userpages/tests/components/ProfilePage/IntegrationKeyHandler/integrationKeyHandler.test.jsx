import React from 'react'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import IntegrationKeyHandler from '$userpages/components/ProfilePage/IntegrationKeyHandler'

const mockLoad = jest.fn()
const mockRemove = jest.fn()
const mockApiOpen = jest.fn()

jest.mock('$shared/modules/integrationKey/hooks/usePrivateKeys', () => (
    jest.fn().mockImplementation(() => ({
        load: mockLoad,
        privateKeys: [{
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

describe('IntegrationKeyHandler', () => {
    beforeEach(() => {
        mockLoad.mockClear()
        mockApiOpen.mockClear()
        mockRemove.mockClear()
    })

    describe('componentDidMount', () => {
        it('loads privateKeys', () => {
            act(() => {
                mount(<IntegrationKeyHandler />)
            })
            expect(mockLoad).toHaveBeenCalled()
        })
    })

    describe('onNew', () => {
        it('must open dialog to add identity', () => {
            const el = shallow(<IntegrationKeyHandler />)

            act(() => {
                el.find('Button').simulate('click')
            })

            expect(mockApiOpen).toHaveBeenCalled()
        })
    })

    describe('onDelete', () => {
        it('must open dialog to add identity', () => {
            const el = mount(<IntegrationKeyHandler />)

            act(() => {
                el.find('ActionsDropdown').find('button').at(2).simulate('click')
            })

            expect(mockRemove).toHaveBeenCalled()
        })
    })

    describe('render', () => {
        it('should render correctly', () => {
            const handler = shallow(<IntegrationKeyHandler />)
            const handlerSegment = handler.find('IntegrationKeyList')
            expect(handlerSegment.exists()).toBe(true)
        })
    })
})
