import React from 'react'
import { MemoryRouter, withRouter } from 'react-router-dom'
import { mount } from 'enzyme'

import { CreateProductButton } from '$mp/components/ActionBar'

describe('CreateProductButton', () => {
    let oldDataUnionsFlag

    beforeEach(() => {
        oldDataUnionsFlag = process.env.DATA_UNIONS
    })

    afterEach(() => {
        process.env.DATA_UNIONS = oldDataUnionsFlag
    })

    describe('DATA_UNIONS=off', () => {
        it('creates a product with the new product page', () => {
            delete process.env.DATA_UNIONS

            const createStub = jest.fn()
            let nextProps
            const Test = withRouter((props) => {
                nextProps = props

                return <CreateProductButton onCreateProduct={createStub} />
            })
            const el = mount((
                <MemoryRouter initialEntries={['/']}>
                    <Test />
                </MemoryRouter>
            ))
            expect(nextProps.location.pathname).toBe('/')
            el.find('a').simulate('click', {
                button: 0,
            })
            expect(nextProps.location.pathname).toBe('/core/products/new')
            expect(nextProps.location.search).toBe('?type=NORMAL')
            expect(createStub).not.toHaveBeenCalled()
        })
    })

    describe('DATA_UNIONS=on', () => {
        it('creates a product with the new product page', () => {
            process.env.DATA_UNIONS = 'on'

            const createStub = jest.fn()
            let nextProps
            const Test = withRouter((props) => {
                nextProps = props

                return <CreateProductButton onCreateProduct={createStub} />
            })
            const el = mount((
                <MemoryRouter initialEntries={['/']}>
                    <Test />
                </MemoryRouter>
            ))
            expect(nextProps.location.pathname).toBe('/')
            el.find('button').simulate('click')
            expect(nextProps.location.pathname).toBe('/')
            expect(createStub).toHaveBeenCalledTimes(1)
        })
    })
})
