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
    let oldDataUnionsFlag

    beforeEach(() => {
        oldDataUnionsFlag = process.env.DATA_UNIONS
    })

    afterEach(() => {
        process.env.DATA_UNIONS = oldDataUnionsFlag
        mockModalApiOpen.mockRestore()
    })

    describe('DATA_UNIONS=off', () => {
        it('creates a data product with the new product page', () => {
            delete process.env.DATA_UNIONS

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
            el.find('a').simulate('click', { button: 0 })
            expect(nextProps.location.pathname).toBe('/core/products/new')
            expect(nextProps.location.search).toBe('?type=NORMAL')
        })
    })

    describe('DATA_UNIONS=on', () => {
        it('creates a product with the product chooser modal', () => {
            process.env.DATA_UNIONS = 'on'

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
})
