import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

import { Edit } from '$userpages/components/ProductsPage/MenuItems'

describe('MenuItems', () => {
    let oldMpContractFlag

    beforeEach(() => {
        oldMpContractFlag = process.env.NEW_MP_CONTRACT
    })

    afterEach(() => {
        process.env.NEW_MP_CONTRACT = oldMpContractFlag
    })

    describe('Edit', () => {
        it('creates a link to new product editor when NEW_MP_CONTRACT=on', () => {
            process.env.NEW_MP_CONTRACT = 'on'

            const el = mount((
                <MemoryRouter>
                    <Edit id="123" />
                </MemoryRouter>
            ))
            expect(el.find('Link').prop('to')).toBe('/core/products/123/edit')
        })

        it('creates a link to new product editor when NEW_MP_CONTRACT=off', () => {
            process.env.NEW_MP_CONTRACT = ''

            const el = mount((
                <MemoryRouter>
                    <Edit id="123" />
                </MemoryRouter>
            ))
            expect(el.find('Link').prop('to')).toBe('/marketplace/products/123/edit')
        })
    })
})
