import React from 'react'
import { render } from '@testing-library/react'
import Checkbox from '../../../../src/shared/components/Checkbox'

describe('Checkbox', () => {
    let container
    beforeEach(() => {
        const renderResult = render(<Checkbox value />)
        container = renderResult.container
    })
    it('renders the component', () => {
        expect(container.querySelector('input[type="checkbox"]')).toBeTruthy()
    })
    it('sets input value correctly', () => {
        expect(
            container.querySelector('input[type="checkbox"]').getAttribute('checked'),
        ).not.toBeNull()
    })
})
