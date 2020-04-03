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
    let oldMpContractFlag
    let oldDataUnionsFlag

    beforeEach(() => {
        oldMpContractFlag = process.env.NEW_MP_CONTRACT
        oldDataUnionsFlag = process.env.DATA_UNIONS
    })

    afterEach(() => {
        process.env.NEW_MP_CONTRACT = oldMpContractFlag
        process.env.DATA_UNIONS = oldDataUnionsFlag
        mockModalApiOpen.mockRestore()
    })

    describe('NEW_MP_CONTRACT=off, DATA_UNIONS=off', () => {
        it('creates a product with the deprecated editor', () => {
            delete process.env.NEW_MP_CONTRACT
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
            expect(nextProps.location.pathname).toBe('/marketplace/products/create')
        })
    })

    describe('NEW_MP_CONTRACT=on, DATA_UNIONS=off', () => {
        it('creates a product with the new product page', () => {
            process.env.NEW_MP_CONTRACT = 'on'
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

    describe('NEW_MP_CONTRACT=on, DATA_UNIONS=on', () => {
        it('creates a product with the new product page', () => {
            process.env.NEW_MP_CONTRACT = 'on'
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
