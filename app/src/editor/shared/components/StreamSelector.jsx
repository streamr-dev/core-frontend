// @flow

import React from 'react'
import Text from '$editor/canvas/components/Ports/Value/Text'
import debounce from 'lodash/debounce'

import { getStreams, getStream } from '../../canvas/services'

import styles from './StreamSelector.pcss'

type Props = {
    className?: ?string,
    value: any,
    disabled: boolean,
    onChange: (value: string) => void,
    onUpdate?: () => void,
}

type State = {
    loadedStream: any,
    isOpen: boolean,
    search: string,
    matchingStreams: Array<Object>,
}

export default class StreamSelector extends React.Component<Props, State> {
    currentSearch: string

    state = {
        loadedStream: undefined,
        isOpen: false,
        search: '',
        matchingStreams: [],
    }

    unmounted = false

    componentDidMount() {
        this.loadStream()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.value !== this.props.value) {
            this.loadStream()
        }
        const didLoad = (
            prevState.matchingStreams !== this.state.matchingStreams
            || prevState.loadedStream !== this.state.loadedStream
        )
        if (didLoad && typeof this.props.onUpdate === 'function') {
            this.props.onUpdate()
        }
    }

    loadStream = async () => {
        const { value } = this.props
        const { loadedStream } = this.state
        if (!value) { return }
        // do nothing if stream already loaded
        if (loadedStream && loadedStream.id === value) { return }
        const stream = await getStream(value)

        if (this.unmounted || this.props.value !== value) { return }

        /* eslint-disable-next-line react/no-did-mount-set-state */
        this.setState({
            loadedStream: stream,
            search: stream.name,
        })
    }

    onChange = (value: string) => {
        this.search(value)
    }

    searchStreams = debounce(async (search = '') => {
        search = search.trim()
        const params = {
            id: '',
            search,
            sortBy: 'lastUpdated',
            order: 'desc',
            uiChannel: false,
            public: true,
        }

        const [exactMatch, matchingStreams] = await Promise.all([
            // getStream with empty id responds with all streams :O
            search && getStream(search).catch((err) => {
                if (err.response && err.response.status === 404) {
                    // ignore 404, expected.
                    return
                }
                throw err
            }),
            getStreams(params),
        ])

        if (this.unmounted || this.currentSearch !== search) { return }

        this.setState({
            matchingStreams: exactMatch ? [exactMatch] : matchingStreams,
        })
    }, 500)

    search = async (search: string = '') => {
        this.currentSearch = search
        search = search.trim()
        this.setState({
            search,
            matchingStreams: [],
        })

        this.searchStreams(search)
    }

    onStreamClick = (id: string) => {
        const { onChange } = this.props
        this.setState({
            isOpen: false,
            matchingStreams: [],
        })
        onChange(id)
    }

    toggleSearch = (isOpen: boolean) => {
        this.setState(({ search, loadedStream }) => {
            if (!isOpen && loadedStream) {
                // set search text to stream name on close
                search = loadedStream.name
            }

            return {
                isOpen,
                search,
            }
        }, () => {
            if (this.state.isOpen) {
                this.search(this.state.search)
            }
        })

        if (typeof this.props.onUpdate === 'function') {
            this.props.onUpdate()
        }
    }

    render() {
        const { disabled, className, value } = this.props
        const { isOpen, search, matchingStreams } = this.state

        return (
            <div className={className}>
                <Text
                    disabled={!!disabled}
                    immediateCommit
                    onChange={this.onChange}
                    onModeChange={this.toggleSearch}
                    placeholder="Value"
                    value={search}
                    title={value}
                />
                {isOpen && (
                    <div className={styles.searchResults}>
                        {matchingStreams.map((stream) => (
                            <div
                                role="button"
                                className={styles.result}
                                key={stream.id}
                                onMouseDown={() => this.onStreamClick(stream.id)}
                                tabIndex="0"
                                title={stream.id}
                            >
                                <div>{stream.name}</div>
                                {!!stream.description && (
                                    <div title={stream.description} className={styles.description}>{stream.description}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }
}
