import React from 'react'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import EditorNav, { statuses } from '../'

describe('EditorNav', () => {
    it('renders an empty list by default', () => {
        const el = shallow(<EditorNav />)
        expect(el.find('NavSection')).toHaveLength(0)
    })

    it('renders sections', () => {
        const sections = [{
            id: 'name',
            heading: 'Name',
        }, {
            id: 'coverImage',
            heading: 'Cover Image',
        }, {
            id: 'description',
            heading: 'Description',
        }, {
            id: 'streams',
            heading: 'Streams',
        }, {
            id: 'price',
            heading: 'Price',
        }, {
            id: 'details',
            heading: 'Details',
        }]

        const el = shallow(<EditorNav sections={sections} />)
        expect(el.find('NavSection')).toHaveLength(6)
    })

    it('renders seen icons by default', () => {
        const sections = [{
            id: 'name',
            heading: 'Name',
        }, {
            id: 'coverImage',
            heading: 'Cover Image',
        }, {
            id: 'description',
            heading: 'Description',
        }, {
            id: 'streams',
            heading: 'Streams',
        }]

        let el
        act(() => {
            el = mount(<EditorNav sections={sections} />)
        })
        const icons = el.update().find('Icons')

        expect(icons.at(0).prop('name')).toBe('seen')
        expect(icons.at(1).prop('name')).toBe('seen')
        expect(icons.at(2).prop('name')).toBe('seen')
        expect(icons.at(3).prop('name')).toBe('seen')
    })

    describe('active section', () => {
        it('highlights the active section', () => {
            const sections = [{
                id: 'name',
                heading: 'Name',
            }, {
                id: 'coverImage',
                heading: 'Cover Image',
            }, {
                id: 'description',
                heading: 'Description',
            }, {
                id: 'streams',
                heading: 'Streams',
            }, {
                id: 'price',
                heading: 'Price',
            }, {
                id: 'details',
                heading: 'Details',
            }]

            let el
            act(() => {
                el = mount(<EditorNav sections={sections} activeSection="price" />)
            })
            const nav = el.find('NavSection')

            expect(nav.at(0).prop('active')).toBe(false)
            expect(nav.at(1).prop('active')).toBe(false)
            expect(nav.at(2).prop('active')).toBe(false)
            expect(nav.at(3).prop('active')).toBe(false)
            expect(nav.at(4).prop('active')).toBe(true)
            expect(nav.at(5).prop('active')).toBe(false)
        })

        it('shows different icon for the active section', () => {
            const sections = [{
                id: 'name',
                heading: 'Name',
            }, {
                id: 'coverImage',
                heading: 'Cover Image',
            }, {
                id: 'description',
                heading: 'Description',
            }, {
                id: 'streams',
                heading: 'Streams',
            }]

            let el
            act(() => {
                el = mount(<EditorNav sections={sections} activeSection="description" />)
            })
            const icons = el.update().find('Icons')

            expect(icons.at(0).prop('name')).toBe('seen')
            expect(icons.at(1).prop('name')).toBe('seen')
            expect(icons.at(2).prop('name')).toBe('active')
            expect(icons.at(3).prop('name')).toBe('seen')
        })
    })

    describe('trackScrolling', () => {
        it('renders sections as unseen', () => {
            const sections = [{
                id: 'name',
                heading: 'Name',
            }, {
                id: 'coverImage',
                heading: 'Cover Image',
            }, {
                id: 'description',
                heading: 'Description',
            }, {
                id: 'streams',
                heading: 'Streams',
            }]

            let el
            act(() => {
                el = mount(<EditorNav sections={sections} trackScrolling />)
            })
            const icons = el.update().find('Icons')

            expect(icons.at(0).prop('name')).toBe('default')
            expect(icons.at(1).prop('name')).toBe('default')
            expect(icons.at(2).prop('name')).toBe('default')
            expect(icons.at(3).prop('name')).toBe('default')
        })

        it('renders sections as seen up the active section', () => {
            const sections = [{
                id: 'name',
                heading: 'Name',
            }, {
                id: 'coverImage',
                heading: 'Cover Image',
            }, {
                id: 'description',
                heading: 'Description',
            }, {
                id: 'streams',
                heading: 'Streams',
            }]

            let el
            act(() => {
                el = mount(<EditorNav sections={sections} trackScrolling />)
            })

            let icons = el.update().find('Icons')
            expect(icons.at(0).prop('name')).toBe('default')
            expect(icons.at(1).prop('name')).toBe('default')
            expect(icons.at(2).prop('name')).toBe('default')
            expect(icons.at(3).prop('name')).toBe('default')

            act(() => {
                el.setProps({
                    activeSection: 'description',
                })
            })
            icons = el.update().find('Icons')

            expect(icons.at(0).prop('name')).toBe('seen')
            expect(icons.at(1).prop('name')).toBe('seen')
            expect(icons.at(2).prop('name')).toBe('active')
            expect(icons.at(3).prop('name')).toBe('default')
        })

        it('renders sections as seen up to a section with status', () => {
            const sections = [{
                id: 'name',
                heading: 'Name',
            }, {
                id: 'coverImage',
                heading: 'Cover Image',
            }, {
                id: 'description',
                heading: 'Description',
                status: statuses.VALID,
            }, {
                id: 'streams',
                heading: 'Streams',
            }]

            let el
            act(() => {
                el = mount(<EditorNav sections={sections} trackScrolling />)
            })
            const icons = el.update().find('Icons')

            expect(icons.at(0).prop('name')).toBe('seen')
            expect(icons.at(1).prop('name')).toBe('seen')
            expect(icons.at(2).prop('name')).toBe('seen')
            expect(icons.at(3).prop('name')).toBe('default')
        })
    })

    describe('showValidation', () => {
        it('shows only unpublished change icon when showValidation is false', () => {
            const sections = [{
                id: 'name',
                heading: 'Name',
                status: statuses.ERROR,
            }, {
                id: 'coverImage',
                heading: 'Cover Image',
                status: statuses.VALID,
            }, {
                id: 'description',
                heading: 'Description',
                status: statuses.UNPUBLISHED,
            }, {
                id: 'streams',
                heading: 'Streams',
                status: statuses.EMPTY,
            }]

            let el
            act(() => {
                el = mount(<EditorNav sections={sections} />)
            })
            const icons = el.update().find('Icons')

            expect(icons.at(0).prop('name')).toBe('seen')
            expect(icons.at(1).prop('name')).toBe('seen')
            expect(icons.at(2).prop('name')).toBe('unpublished')
            expect(icons.at(3).prop('name')).toBe('seen')
        })

        it('shows status icons when showValidation is true', () => {
            const sections = [{
                id: 'name',
                heading: 'Name',
                status: statuses.ERROR,
            }, {
                id: 'coverImage',
                heading: 'Cover Image',
                status: statuses.VALID,
            }, {
                id: 'description',
                heading: 'Description',
                status: statuses.UNPUBLISHED,
            }, {
                id: 'streams',
                heading: 'Streams',
                status: statuses.EMPTY,
            }]

            let el
            act(() => {
                el = mount(<EditorNav sections={sections} showValidation />)
            })
            const icons = el.update().find('Icons')
            expect(icons.at(0).prop('name')).toBe('error')
            expect(icons.at(1).prop('name')).toBe('valid')
            expect(icons.at(2).prop('name')).toBe('unpublished')
            expect(icons.at(3).prop('name')).toBe('seen')
        })

        it('shows different error icon for the active section', () => {
            const sections = [{
                id: 'name',
                heading: 'Name',
            }, {
                id: 'coverImage',
                heading: 'Cover Image',
            }, {
                id: 'description',
                heading: 'Description',
                status: statuses.ERROR,
            }, {
                id: 'streams',
                heading: 'Streams',
            }]

            let el
            act(() => {
                el = mount(<EditorNav
                    sections={sections}
                    activeSection="description"
                    showValidation
                />)
            })
            const icons = el.update().find('Icons')

            expect(icons.at(0).prop('name')).toBe('seen')
            expect(icons.at(1).prop('name')).toBe('seen')
            expect(icons.at(2).prop('name')).toBe('activeError')
            expect(icons.at(3).prop('name')).toBe('seen')
        })
    })
})
