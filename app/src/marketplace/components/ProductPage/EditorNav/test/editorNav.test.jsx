import React from 'react'
import { render, cleanup } from '@testing-library/react'

import EditorNav, { statuses } from '../'

describe('EditorNav', () => {
    afterEach(cleanup)

    it('renders an empty list by default', () => {
        const { queryAllByTestId } = render(<EditorNav />)
        expect(queryAllByTestId(/^NavSection/)).toHaveLength(0)
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

        const { queryAllByTestId } = render(<EditorNav sections={sections} />)
        expect(queryAllByTestId(/^NavSection/)).toHaveLength(6)
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

        const { queryAllByTestId } = render(<EditorNav sections={sections} />)

        expect(queryAllByTestId(/^Icons/)).toHaveLength(4)

        expect(queryAllByTestId('Icons#seen')).toHaveLength(4)
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

            const { queryAllByTestId, getByTestId } = render(<EditorNav sections={sections} activeSection="price" />)

            expect(queryAllByTestId('Icons#seen')).toHaveLength(5)

            expect(queryAllByTestId('Icons#active')).toHaveLength(1)

            expect(getByTestId('NavSection#price')).toHaveClass('active')
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

            const { queryAllByTestId } = render(<EditorNav sections={sections} trackScrolling />)

            expect(queryAllByTestId('Icons#default')).toHaveLength(4)
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

            const { queryAllByTestId, rerender } = render(<EditorNav sections={sections} trackScrolling />)

            expect(queryAllByTestId('Icons#default')).toHaveLength(4)

            rerender(<EditorNav sections={sections} trackScrolling activeSection="description" />)

            const icons = queryAllByTestId(/^Icons/)

            expect(icons[0]).toHaveAttribute('data-testid', 'Icons#seen')

            expect(icons[1]).toHaveAttribute('data-testid', 'Icons#seen')

            expect(icons[2]).toHaveAttribute('data-testid', 'Icons#active')

            expect(icons[3]).toHaveAttribute('data-testid', 'Icons#default')
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

            const { queryAllByTestId } = render(<EditorNav sections={sections} trackScrolling />)

            const icons = queryAllByTestId(/^Icons/)

            expect(icons[0]).toHaveAttribute('data-testid', 'Icons#seen')

            expect(icons[1]).toHaveAttribute('data-testid', 'Icons#seen')

            expect(icons[2]).toHaveAttribute('data-testid', 'Icons#valid')

            expect(icons[3]).toHaveAttribute('data-testid', 'Icons#default')
        })
    })

    describe('showErrors', () => {
        it('it doesnt show error icons when showErrors is false', () => {
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

            const { queryAllByTestId } = render(<EditorNav sections={sections} />)

            const icons = queryAllByTestId(/^Icons/)

            expect(icons[0]).toHaveAttribute('data-testid', 'Icons#seen')

            expect(icons[1]).toHaveAttribute('data-testid', 'Icons#valid')

            expect(icons[2]).toHaveAttribute('data-testid', 'Icons#unpublished')

            expect(icons[3]).toHaveAttribute('data-testid', 'Icons#seen')
        })

        it('shows error icons when showErrors is true', () => {
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

            const { queryAllByTestId } = render(<EditorNav sections={sections} showErrors />)

            const icons = queryAllByTestId(/^Icons/)

            expect(icons[0]).toHaveAttribute('data-testid', 'Icons#error')

            expect(icons[1]).toHaveAttribute('data-testid', 'Icons#valid')

            expect(icons[2]).toHaveAttribute('data-testid', 'Icons#unpublished')

            expect(icons[3]).toHaveAttribute('data-testid', 'Icons#seen')
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

            const { queryAllByTestId } = render(<EditorNav sections={sections} activeSection="description" showErrors />)

            const icons = queryAllByTestId(/^Icons/)

            expect(icons[0]).toHaveAttribute('data-testid', 'Icons#seen')

            expect(icons[1]).toHaveAttribute('data-testid', 'Icons#seen')

            expect(icons[2]).toHaveAttribute('data-testid', 'Icons#activeError')

            expect(icons[3]).toHaveAttribute('data-testid', 'Icons#seen')
        })
    })
})
