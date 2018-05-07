// @flow

import React from 'react'
import classNames from 'classnames'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import { Container, Input, Button, DropdownItem } from '@streamr/streamr-layout'

import type { Stream, StreamList, StreamIdList, StreamId } from '../../../flowtype/stream-types'
import type { PropertySetter } from '../../../flowtype/common-types'
import StreamListing from '../../ProductPage/StreamListing'
import pageStyles from '../productPageEditor.pcss'
import Dropdown from '../ProductDetailsEditor/Dropdown'

import type { Product } from '../../../flowtype/product-types'
import styles from './streamSelector.pcss'

export type Props = {
    product: ?Product,
    fetchingStreams: boolean,
    streams: StreamList,
    availableStreams: StreamList,
    onEdit: PropertySetter<string | number>,
}

type State = {
    isEditing: boolean,
    search: string,
    sort: string,
    initialized: boolean,
    selectedStreams: StreamIdList,
    nextStreams: StreamIdList,
}

const RemoveIcon = () => (
    <svg className={styles.RemoveIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <path
            fill="white"
            d="M9 11.333H5.333a.667.667 0 1 1 0-1.333H9c.92 0 1.667-.748
            1.667-1.667 0-.918-.748-1.666-1.667-1.666H7.333v1a.335.335 0
            0 1-.51.282L4.157 6.283a.333.333 0 0 1 0-.566l2.666-1.666a.333.333
            0 0 1 .51.282v1H9c1.654 0 3 1.346 3 3s-1.346 3-3 3M8 0a8 8 0 1 0 0
            16A8 8 0 0 0 8 0"
        />
    </svg>
)

const SORT_BY_NAME = 'name'
const SORT_BY_RECENT = 'recent'
const SORT_BY_ADDED = 'added'

function getSortedStreams({ sort, matchingStreams, nextStreams }) {
    let sortOptions
    if (sort === SORT_BY_ADDED) {
        sortOptions = ['isAdded', 'lowerName']
    }
    if (sort === SORT_BY_NAME) {
        sortOptions = ['lowerName']
    }
    if (sort === SORT_BY_RECENT) {
        sortOptions = ['lastUpdated']
    }

    return sortBy(matchingStreams.map((s) => ({
        ...s,
        lowerName: s.name.toLowerCase(),
        isAdded: -Number(nextStreams.has(s.id)),
    })), sortOptions)
}

class StreamSelector extends React.Component<Props, State> {
    state = {
        isEditing: false,
        search: '',
        sort: SORT_BY_NAME,
        initialized: !!this.props.streams.length,
        nextStreams: this.props.streams.map((s) => s.id),
        selectedStreams: [],
    }

    componentWillReceiveProps(nextProps: Props) {
        const { streams } = nextProps
        // initialized flag prevents changing streams after already initialized
        if (this.state.initialized) {
            return
        }
        this.setState({
            initialized: !!streams.length,
            nextStreams: streams.map((s) => s.id),
        })
    }

    onChange = (event: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            search: event.target.value,
        })
    }

    onToggle = (id: StreamId) => {
        const { selectedStreams } = this.state
        this.setState({
            selectedStreams: selectedStreams.includes(id)
                ? selectedStreams.filter((sid) => sid !== id) // remove if selected
                : selectedStreams.concat(id), // add if not selected
        })
    }

    onSelectAll = (ids: StreamIdList) => {
        const { selectedStreams } = this.state
        this.setState({
            selectedStreams: uniq(selectedStreams.concat(ids)),
        })
    }

    onSelectNone = (ids: StreamIdList) => {
        const { selectedStreams } = this.state
        this.setState({
            selectedStreams: uniq(selectedStreams.filter((id) => !ids.includes(id))),
        })
    }

    onRemove = (id: StreamId) => {
        const nextStreams = uniq(this.state.nextStreams.filter((sid) => sid !== id))
        this.setState({
            nextStreams,
        })

        this.props.onEdit('streams', nextStreams)
    }

    onAdd = () => {
        const { selectedStreams } = this.state
        const nextStreams = uniq(this.state.nextStreams.concat(selectedStreams))
        this.setState({
            selectedStreams: [],
            nextStreams,
        })

        this.props.onEdit('streams', nextStreams)
        this.onStopEdit()
    }

    onStartEdit = () => {
        this.setState({
            isEditing: true,
            sort: this.state.sort,
        })
    }

    onStopEdit = () => {
        this.setState({
            isEditing: false,
        })
    }

    onChangeSort = (sort: string) => {
        this.setState({
            sort,
        })
    }

    render() {
        const { availableStreams, fetchingStreams } = this.props
        const { search, isEditing, sort } = this.state
        const matchingStreams: StreamList = availableStreams.filter((stream) => (
            stream.name.toLowerCase().includes(search.toLowerCase())
        ))

        // coerce arrays to Set as we are checking existence in a loop
        const nextStreams = new Set(this.state.nextStreams)
        const selectedStreams = new Set(this.state.selectedStreams)
        const allStreamsSelected = selectedStreams.size === matchingStreams.length

        const sortedStreams = getSortedStreams({
            sort,
            nextStreams,
            matchingStreams,
        })

        if (!isEditing) {
            return (
                <div className={pageStyles.section}>
                    <Container>
                        <div className={styles.root}>
                            <StreamListing {...this.props} streams={availableStreams.filter(({ id }) => nextStreams.has(id))} />
                            <div className={styles.footer}>
                                <Button
                                    className={styles.editButton}
                                    color="primary"
                                    onClick={this.onStartEdit}
                                >
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </Container>
                </div>
            )
        }
        return (
            <div className={pageStyles.section}>
                <Container>
                    <div className={styles.root}>
                        {!!fetchingStreams && <span>Loading streams...</span>}
                        <div className={styles.inputContainer}>
                            <Input
                                className={styles.input}
                                onChange={this.onChange}
                                value={this.state.search}
                                placeholder="Type to search & select streams or click to select individually"
                            />
                            <Dropdown
                                type="text"
                                name="sort"
                                id="sort"
                                placeholder="Sort by"
                                className={classNames(styles.sortDropdown, styles.dropdown)}
                                title={
                                    <span className={styles.sortDropdownTitle}>Sort by {sort} &#9662;</span>
                                }
                            >
                                <DropdownItem onClick={() => this.onChangeSort(SORT_BY_NAME)}>
                                    Name
                                </DropdownItem>
                                <DropdownItem onClick={() => this.onChangeSort(SORT_BY_RECENT)}>
                                    Recent
                                </DropdownItem>
                                <DropdownItem onClick={() => this.onChangeSort(SORT_BY_ADDED)}>
                                    Added
                                </DropdownItem>
                            </Dropdown>
                        </div>
                        <div className={styles.streams}>
                            {sortedStreams.map((stream: Stream) => (
                                <div
                                    key={stream.id}
                                    className={classNames(styles.stream, {
                                        [styles.added]: nextStreams.has(stream.id),
                                        [styles.selected]: selectedStreams.has(stream.id),
                                    })}
                                >
                                    {nextStreams.has(stream.id) && (
                                        <a
                                            className={styles.removeButton}
                                            href="#"
                                            title="Remove from selection"
                                            onClick={(event: SyntheticInputEvent<EventTarget>) => {
                                                event.preventDefault()
                                                event.stopPropagation()
                                                this.onRemove(stream.id)
                                            }}
                                        >
                                            <RemoveIcon />
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        className={styles.addButton}
                                        onClick={() => {
                                            if (nextStreams.has(stream.id)) {
                                                return
                                            }
                                            this.onToggle(stream.id)
                                        }}
                                    >
                                        {stream.name}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className={styles.footer}>
                            {`Streams (${this.state.nextStreams.length})`}
                            <Button
                                onClick={() => {
                                    const toSelect = matchingStreams
                                        .map((s) => s.id)
                                        .filter((id) => !nextStreams.has(id))

                                    if (allStreamsSelected) {
                                        this.onSelectNone(toSelect)
                                    } else {
                                        this.onSelectAll(toSelect)
                                    }
                                }}
                            >
                                {!allStreamsSelected
                                    ? 'Select All'
                                    : 'Select None'
                                }
                            </Button>
                            <Button color="primary" onClick={() => this.onAdd()}>
                                Add
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
}

export default StreamSelector
