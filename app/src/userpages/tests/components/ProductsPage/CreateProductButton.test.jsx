import React from 'react'
import { MemoryRouter, withRouter } from 'react-router-dom'
import { mount } from 'enzyme'

import { CreateProductButton } from '$userpages/components/ProductsPage'

const mockModalApiOpen = jest.fn()
jest.mock('$shared/hooks/useModal', () => ({
    __esModule: true,
    default: () => ({
        api: {
            open: mockModalApiOpen,
        },
    }),
}))

describe('CreateProductButton', () => {
    afterEach(() => {
        mockModalApiOpen.mockRestore()
    })

    it('creates a product with the product chooser modal', () => {
        let nextProps
        const Test = withRouter((props) => {
            nextProps = props

            return <CreateProductButton />
        })
        const el = mount((
            <MemoryRouter initialEntries={['/']}>
                <Test />
            </MemoryRouter>
        ))
        expect(nextProps.location.pathname).toBe('/')
        el.find('button').simulate('click')
        expect(nextProps.location.pathname).toBe('/')
        expect(mockModalApiOpen).toHaveBeenCalledTimes(1)
    })
})
