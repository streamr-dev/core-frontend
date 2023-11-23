import React from 'react'
import {
    act,
    screen,
    fireEvent,
    render,
    RenderResult,
    waitFor,
} from '@testing-library/react'
import MobileFilter from '~/shared/components/MobileFilter'
import { Provider as ModalPortalProvider } from '~/shared/contexts/ModalPortal'
import Mock = jest.Mock

const filters = [
    {
        label: 'Category',
        value: 'category',
        options: [
            { label: 'Business', value: 'business' },
            { label: 'Environment', value: 'environment' },
            { label: 'Entertainment', value: 'entertainment' },
            { label: 'Social Media', value: 'social_media' },
            { label: 'Education', value: 'education' },
            { label: 'Sports', value: 'sports' },
            { label: 'Transportation', value: 'transportation' },
            { label: 'IoT', value: 'iot' },
            {
                label: 'Very long name of a filter, like really long, or more like insanely long',
                value: 'long_filter',
            },
        ],
    },
    {
        label: 'Project type',
        value: 'project_type',
        options: [
            { label: 'Data Union', value: 'data_union' },
            { label: 'Paid Data', value: 'paid_data' },
            { label: 'Open Data', value: 'open_data' },
        ],
    },
]
describe('MobileFilter', () => {
    let spy: Mock = jest.fn()
    let renderResult: RenderResult
    const TestComponent = () => {
        return (
            <div>
                <ModalPortalProvider>
                    <div id={'content'}>
                        <MobileFilter onChange={spy} filters={filters} />
                    </div>
                    <div id={'modal-root'}></div>
                </ModalPortalProvider>
            </div>
        )
    }

    beforeEach(() => {
        spy = jest.fn()
        renderResult = render(<TestComponent />)
    })

    afterEach(() => {
        renderResult.unmount()
    })

    it('should open the filter modal', async () => {
        await act(() => {
            fireEvent.click(screen.getByTestId('mobile-filter-trigger'))
        })
        await waitFor(async () => {
            const optionsList = await screen.getAllByTestId('options-list')
            expect(optionsList).toBeTruthy()
        })
    })

    it('should select a filter', async () => {
        await act(() => {
            fireEvent.click(screen.getByTestId('mobile-filter-trigger'))
        })

        await act(() => {
            fireEvent.click(screen.getAllByTestId('filter-element')[0])
        })

        await act(() => {
            fireEvent.click(screen.getByText('Save'))
        })

        expect(spy).toHaveBeenCalledWith({ category: 'business' })
    })
})
