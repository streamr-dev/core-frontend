import React, { useState } from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import { Input } from 'reactstrap'
import { act } from 'react-dom/test-utils'

import { StreamSelector } from '$mp/components/StreamSelector'
import styles from '$mp/components/StreamSelector/streamSelector.pcss'

describe('StreamSelector', () => {
    let wrapper
    let props
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        props = {
            streams: ['stream-1', 'stream-2'],
            availableStreams: [
                {
                    id: 'stream-1',
                    name: 'Stream 1',
                },
                {
                    id: 'stream-2',
                    name: 'Stream 2',
                },
                {
                    id: 'stream-3',
                    name: 'Stream 3',
                },
                {
                    id: 'stream-4',
                    name: 'Stream 4',
                },
            ],
            translate: (key) => key,
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('Rendering', () => {
        it('renders the component', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            expect(wrapper.length).toEqual(1)
        })

        it('renders the loading indicator', () => {
            wrapper = shallow(<StreamSelector {...props} fetchingStreams />)

            const loadingIndicator = wrapper.find('LoadingIndicator')

            expect(loadingIndicator.length).toEqual(1)
        })

        it('renders the stream listing if not editing', () => {
            wrapper = shallow(<StreamSelector {...props} fetchingStreams />)
            expect(wrapper.find(`.${styles.stream}`).length).toEqual(4)
        })

        it('renders available and selected streams', () => {
            wrapper = mount(<StreamSelector {...props} />)

            expect(wrapper.find(`.${styles.stream}`).length).toEqual(4)
            expect(wrapper.find(`.${styles.selected}`).length).toEqual(2)
        })

        it('renders the multiple selected stream count text', () => {
            wrapper = mount(<StreamSelector {...props} />)

            expect(wrapper.find(`.${styles.selectedCount}`).text()).toEqual('selectedStreams')
        })

        it('renders the one selected stream count text', () => {
            wrapper = mount(<StreamSelector {...props} streams={['stream-1']} />)

            expect(wrapper.find(`.${styles.selectedCount}`).text()).toEqual('selectedStream')
        })

        it('renders no streams text if there are no available streams', () => {
            const newProps = {
                ...props,
                availableStreams: [],
            }
            wrapper = shallow(<StreamSelector {...newProps} />)

            expect(wrapper.find('.noAvailableStreams').length).toEqual(1)
        })

        it('renders the sort dropdown', () => {
            wrapper = shallow(<StreamSelector {...props} />)

            const sortElements = wrapper
                .find('DropdownItem')
                .find('Translate')
                .findWhere((node) =>
                    node.prop('value') === 'streamSelector.sortByName' ||
                    node.prop('value') === 'streamSelector.sortByRecent' ||
                    node.prop('value') === 'streamSelector.sortByAdded')

            expect(sortElements.length).toEqual(3)
        })
    })

    describe('Editing', () => {
        it('selects/deselects a stream', () => {
            function Test() {
                const [streams, setStreams] = useState(['stream-1', 'stream-2'])

                return (<StreamSelector
                    {...props}
                    streams={streams}
                    onEdit={(s) => {
                        setStreams(s)
                    }}
                />)
            }

            act(() => {
                wrapper = mount(<Test />)
            })
            expect(wrapper.find(`.${styles.selected}`).length).toEqual(2)

            act(() => {
                wrapper.find(`.${styles.addButton}`).at(2).simulate('click')
            })
            wrapper.update()
            expect(wrapper.find(`.${styles.selected}`).length).toEqual(3)

            act(() => {
                wrapper.find(`.${styles.addButton}`).at(2).simulate('click')
            })
            wrapper.update()
            expect(wrapper.find(`.${styles.selected}`).length).toEqual(2)
        })

        it('selects all/none', () => {
            function Test() {
                const [streams, setStreams] = useState(['stream-1', 'stream-2'])

                return (<StreamSelector
                    {...props}
                    streams={streams}
                    onEdit={(s) => {
                        setStreams(s)
                    }}
                />)
            }

            act(() => {
                wrapper = mount(<Test />)
            })
            expect(wrapper.find(`.${styles.selected}`).length).toEqual(2)

            act(() => {
                wrapper.find(`.${styles.footer} button`).simulate('click')
            })
            wrapper.update()
            expect(wrapper.find(`.${styles.selected}`).length).toEqual(4)

            act(() => {
                wrapper.find(`.${styles.footer} button`).simulate('click')
            })
            wrapper.update()
            expect(wrapper.find(`.${styles.selected}`).length).toEqual(0)
        })
    })

    describe('Sorting and searching', () => {
        it('sets the sort order', () => {
            wrapper = mount(<StreamSelector {...props} />)
            expect(wrapper.find(`.${styles.sortDropdownTitle}`).text()).toMatch(/sort\s*name/)

            const sortByAdded = wrapper
                .find('DropdownItem')
                .find('Translate')
                .findWhere((node) => node.prop('value') === 'streamSelector.sortByAdded')

            act(() => {
                sortByAdded.simulate('click')
            })
            wrapper.update()
            expect(wrapper.find(`.${styles.sortDropdownTitle}`).text()).toMatch(/sort\s*added/)

            const sortByRecent = wrapper
                .find('DropdownItem')
                .find('Translate')
                .findWhere((node) => node.prop('value') === 'streamSelector.sortByRecent')

            act(() => {
                sortByRecent.simulate('click')
            })
            wrapper.update()
            expect(wrapper.find(`.${styles.sortDropdownTitle}`).text()).toMatch(/sort\s*recent/)
        })

        it('will update state based on search input', () => {
            wrapper = mount(<StreamSelector {...props} />)

            act(() => {
                wrapper.find(Input).simulate('change', {
                    target: {
                        value: 'test search',
                    },
                })
            })
            wrapper.update()

            expect(wrapper.find('Input').prop('value')).toBe('test search')
        })

        it('shows streams matching the search text', () => {
            wrapper = shallow(<StreamSelector {...props} />)

            act(() => {
                wrapper.find(Input).simulate('change', {
                    target: {
                        value: '1',
                    },
                })
            })
            wrapper.update()

            expect(wrapper.find(`.${styles.stream}`).length).toEqual(1)
            expect(wrapper.find(`.${styles.stream}`).contains('Stream 1')).toEqual(true)
            expect(wrapper.find(`.${styles.stream}`).contains('Stream 2')).toEqual(false)
        })
    })
})
