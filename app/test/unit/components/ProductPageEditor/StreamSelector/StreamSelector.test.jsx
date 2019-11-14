import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { Input } from 'reactstrap'

import { StreamSelector } from '$mp/components/deprecated/ProductPageEditor/StreamSelector'

describe('StreamSelector', () => {
    let wrapper
    let props
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        props = {
            streams: [
                {
                    id: 'stream-1',
                },
                {
                    id: 'stream-2',
                },
            ],
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

        it('renders the loading text', () => {
            wrapper = shallow(<StreamSelector {...props} fetchingStreams />)
            wrapper.setState({
                isEditing: true,
            })

            const loadingItems = wrapper
                .find('Translate')
                .findWhere((node) => node.prop('value') === 'streamSelector.loading')

            expect(loadingItems.length).toEqual(1)
        })

        it('renders the stream listing if not editing', () => {
            wrapper = shallow(<StreamSelector {...props} fetchingStreams />)
            expect(wrapper.find('StreamListing').length).toEqual(1)
        })

        it('renders available and selected streams', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            wrapper.setState({
                isEditing: true,
            })

            expect(wrapper.find('.stream').length).toEqual(4)
            expect(wrapper.find('.added').length).toEqual(2)
        })

        it('renders the remove button for previously selected streams', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            wrapper.setState({
                isEditing: true,
            })
            expect(wrapper.find('.removeButton').length).toEqual(2)
        })

        it('renders the selected stream count text', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            wrapper.setState({
                isEditing: true,
                selectedStreams: ['stream-4'],
            })
            expect(wrapper.find('.selectedCount').childAt(0).prop('streamCount')).toEqual(1)
        })

        it('renders no streams text if there are no available streams', () => {
            const newProps = {
                ...props,
                availableStreams: [],
            }
            wrapper = shallow(<StreamSelector {...newProps} />)
            wrapper.setState({
                isEditing: true,
            })

            expect(wrapper.find('.noAvailableStreams').length).toEqual(1)
        })

        it('renders the sort dropdown', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            wrapper.setState({
                isEditing: true,
            })

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
        it('will update state based on received streams', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            expect(wrapper.state('nextStreams')).toEqual(['stream-1', 'stream-2'])
        })

        it('enters and exits editMode correctly', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            wrapper.instance().onStartEdit()
            expect(wrapper.state('isEditing')).toEqual(true)
            wrapper.instance().onCancel()
            expect(wrapper.state('isEditing')).toEqual(false)
        })

        it('selects/deselects a stream', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            wrapper.setState({
                isEditing: true,
            })

            wrapper.find('.addButton').at(2).simulate('click')
            expect(wrapper.state('selectedStreams')).toEqual(['stream-3'])

            wrapper.find('.addButton').at(2).simulate('click')
            expect(wrapper.state('selectedStreams')).toEqual([])
        })

        it('adds streams', () => {
            const onEditStub = sinon.stub()
            const newProps = {
                ...props,
                streams: [],
                onEdit: onEditStub,
            }

            wrapper = shallow(<StreamSelector {...newProps} />)
            wrapper.setState({
                isEditing: true,
            })

            // Click a stream to select it
            wrapper.find('.addButton').at(0).simulate('click')
            expect(wrapper.state('nextStreams')).toEqual([])
            expect(wrapper.state('selectedStreams')).toEqual(['stream-1'])

            // Click 'add' to save changes
            wrapper.findWhere((node) => node.prop('value') === 'streamSelector.add').parent().simulate('click')
            expect(wrapper.state('selectedStreams')).toEqual([])
            expect(wrapper.state('nextStreams')).toEqual(['stream-1'])
            expect(wrapper.state('isEditing')).toEqual(false)

            expect(onEditStub.callCount).toEqual(1)
            expect(onEditStub.calledWith('streams', ['stream-1'])).toEqual(true)
        })

        it('removes streams', () => {
            const onEditStub = sinon.stub()
            const newProps = {
                ...props,
                onEdit: onEditStub,
            }

            wrapper = shallow(<StreamSelector {...newProps} />)
            wrapper.setState({
                isEditing: true,
            })
            expect(wrapper.state('nextStreams')).toEqual(['stream-1', 'stream-2'])
            expect(wrapper.state('selectedStreams')).toEqual([])

            // Remove a stream
            wrapper.find('.removeButton').at(0).simulate('click', {
                stopPropagation: () => undefined,
                preventDefault: () => undefined,
            })
            expect(wrapper.state('removedStreams')).toEqual(['stream-1'])
            expect(wrapper.state('selectedStreams')).toEqual([])

            // Click 'Add' to save changes
            wrapper.findWhere((node) => node.prop('value') === 'streamSelector.add').parent().simulate('click')
            expect(wrapper.state('nextStreams')).toEqual(['stream-2'])
            expect(wrapper.state('selectedStreams')).toEqual([])
            expect(wrapper.state('removedStreams')).toEqual([])
            expect(wrapper.state('isEditing')).toEqual(false)

            expect(onEditStub.callCount).toEqual(1)
            expect(onEditStub.calledWith('streams', ['stream-2'])).toEqual(true)
        })

        it('selects all/none', () => {
            const newProps = {
                ...props,
                streams: [],
            }

            wrapper = shallow(<StreamSelector {...newProps} />)
            wrapper.setState({
                isEditing: true,
            })

            wrapper.findWhere((node) => node.prop('value') === 'streamSelector.selectAll').parent().simulate('click')
            expect(wrapper.state('selectedStreams')).toEqual(['stream-1', 'stream-2', 'stream-3', 'stream-4'])

            wrapper.findWhere((node) => node.prop('value') === 'streamSelector.selectNone').parent().simulate('click')
            expect(wrapper.state('selectedStreams')).toEqual([])
        })
    })

    describe('Sorting and searching', () => {
        it('sets the sort order', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            wrapper.setState({
                isEditing: true,
            })

            const sortByName = wrapper
                .find('DropdownItem')
                .find('Translate')
                .findWhere((node) => node.prop('value') === 'streamSelector.sortByName')
            sortByName.simulate('click')
            expect(wrapper.state('sort')).toEqual('name')
        })

        it('will update state based on search input', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            wrapper.setState({
                isEditing: true,
            })
            wrapper.find(Input).simulate('change', {
                target: {
                    value: 'test search',
                },
            })

            expect(wrapper.state('search')).toEqual('test search')
        })

        it('shows streams matching the search text', () => {
            wrapper = shallow(<StreamSelector {...props} />)
            wrapper.setState({
                isEditing: true,
                search: '1',
            })

            expect(wrapper.find('.stream').length).toEqual(1)
            expect(wrapper.find('.stream').contains('Stream 1')).toEqual(true)
            expect(wrapper.find('.stream').contains('Stream 2')).toEqual(false)
        })
    })
})
