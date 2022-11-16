import React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import MobileFilter from '$shared/components/MobileFilter'
import { ModalPortalProvider } from '$shared/contexts/ModalPortal'
import Mock = jest.Mock

const filters = [{
    label: 'Category',
    value: 'category',
    options: [
        {label: 'Business', value: 'business'},
        {label: 'Environment', value: 'environment'},
        {label: 'Entertainment', value: 'entertainment'},
        {label: 'Social Media', value: 'social_media'},
        {label: 'Education', value: 'education'},
        {label: 'Sports', value: 'sports'},
        {label: 'Transportation', value: 'transportation'},
        {label: 'IoT', value: 'iot'},
        {label: 'Very long name of a filter, like really long, or more like insanely long', value: 'long_filter'}
    ]
}, {
    label: 'Project type',
    value: 'project_type',
    options: [
        {label: 'Data Union', value: 'data_union'},
        {label: 'Paid Data', value: 'paid_data'},
        {label: 'Open Data', value: 'open_data'}
    ]
}]
describe('MobileFilter', () => {
    let spy: Mock = jest.fn()
    let element: ReactWrapper
    const TestComponent = () => {
        return <div>
            <ModalPortalProvider>
                <div id={'content'}>
                    <MobileFilter
                        onChange={spy}
                        filters={filters}
                    />
                </div>
                <div id={'modal-root'}></div>
            </ModalPortalProvider>
        </div>
    }

    beforeEach(() => {
        spy = jest.fn()
        element = mount(<TestComponent/>, {attachTo: document.body})
    })

    afterEach(() => {
        element.detach()
    })

    it('should open the filter modal', () => {
        element.find('#mobile-filter-trigger').first().simulate('click')
        expect(element.find('.options-list').exists()).toBe(true)
    })

    // TODO - try to fix it in the future
    it.skip('should select a filter', () => {
        element.find('#mobile-filter-trigger').first().simulate('click')
        element.find({htmlFor: 'category-business'}).simulate('click')
        element.find('.filter-save-button').first().simulate('click')
        expect(spy).toHaveBeenCalledWith({category: 'business'})
    })

})
