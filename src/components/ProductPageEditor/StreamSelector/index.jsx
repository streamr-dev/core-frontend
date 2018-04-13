// @flow

import React from 'react'
import classNames from 'classnames'
import uniq from 'lodash/uniq'
import { Container, Input, Button } from '@streamr/streamr-layout'

import type { Stream, StreamList, StreamIdList, StreamId } from '../../../flowtype/stream-types'
import pageStyles from '../productPageEditor.pcss'

import styles from './streamSelector.pcss'

export type Props = {
    fetchingStreams: boolean,
    streams: StreamList,
    availableStreams: StreamList,
}

type State = {
    search: string,
    initialized: boolean,
    selectedStreams: StreamIdList,
    nextStreams: StreamIdList,
}

class StreamSelector extends React.Component<Props, State> {
    state = {
        search: '',
        initialized: !!this.props.streams.length,
        nextStreams: this.props.streams.map((s) => s.id),
        selectedStreams: [],
    }

    componentWillReceiveProps(nextProps: Props) {
        const { streams } = nextProps
        // initialized flag prevents changing streams after already initialized
        if (this.state.initialized) { return }
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

    onAdd = () => {
        const { nextStreams, selectedStreams } = this.state
        this.setState({
            selectedStreams: [],
            nextStreams: uniq(nextStreams.concat(selectedStreams)),
        })
    }

    render() {
        const { availableStreams, fetchingStreams } = this.props
        const { search } = this.state
        const matchingStreams: StreamList = availableStreams.filter((stream) => (
            stream.name.toLowerCase().includes(search.toLowerCase())
        ))

        // coerce arrays to Set as we are checking existence in a loop
        const nextStreams = new Set(this.state.nextStreams)
        const selectedStreams = new Set(this.state.selectedStreams)

        const allStreamsSelected = selectedStreams.size === matchingStreams.length

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
                        </div>
                        <div className={styles.streams}>
                            {matchingStreams.map((stream: Stream) => (
                                <button
                                    key={stream.id}
                                    className={classNames(styles.stream, {
                                        [styles.added]: nextStreams.has(stream.id),
                                        [styles.selected]: selectedStreams.has(stream.id),
                                    })}
                                    type="button"
                                    onClick={() => this.onToggle(stream.id)}
                                >
                                    {stream.name}
                                </button>
                            ))}
                        </div>
                        <div className={styles.footer}>
                            {`Streams (${this.state.nextStreams.length})`}
                            <Button
                                onClick={() => {
                                    const toSelect = matchingStreams.map((s) => s.id)
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
                            <Button onClick={() => this.onAdd()}>
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
