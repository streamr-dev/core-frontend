import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import useNewProductMode from '../useNewProductMode'
describe('useNewProductMode', () => {
    it('works when newProduct flag is not defined', () => {
        let result

        function Test() {
            result = useNewProductMode()
            return null
        }

        mount(
            <MemoryRouter initialEntries={['/products/1234/edit']}>
                <Test />
            </MemoryRouter>,
        )
        expect(result.isNew).toBe(false)
    })
    it('works when newProduct flag is defined', () => {
        let result

        function Test() {
            result = useNewProductMode()
            return null
        }

        mount(
            <MemoryRouter initialEntries={['/products/1234/edit?newProduct=true']}>
                <Test />
            </MemoryRouter>,
        )
        expect(result.isNew).toBe(true)
    })
    it('gets dataUnionAddress correctly', () => {
        let result

        function Test() {
            result = useNewProductMode()
            return null
        }

        mount(
            <MemoryRouter initialEntries={['/products/1234/edit?newProduct=true&dataUnionAddress=0x123']}>
                <Test />
            </MemoryRouter>,
        )
        expect(result.dataUnionAddress).toBe('0x123')
    })
    it('gets chainId correctly', () => {
        let result

        function Test() {
            result = useNewProductMode()
            return null
        }

        mount(
            <MemoryRouter initialEntries={['/products/1234/edit?newProduct=true&dataUnionAddress=0x123&chainId=1337']}>
                <Test />
            </MemoryRouter>,
        )
        expect(result.chainId).toBe(1337)
    })
})
