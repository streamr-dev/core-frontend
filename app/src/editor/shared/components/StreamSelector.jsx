// @flow

import React from 'react'

import { getStreams, getStream } from '../../canvas/services'

import styles from './StreamSelector.pcss'

type Props = {
    className?: ?string,
    value: any,
    disabled: boolean,
    onChange: (value: string, done: any) => void,
    onBlur?: ?(event: any) => void,
    onFocus?: ?(event: any) => void,
}

type State = {
    isOpen: boolean,
    search: string,
    matchingStreams: Array<Object>,
}

export default class StreamSelector extends React.Component<Props, State> {
    state = {
        isOpen: false,
        search: '',
        matchingStreams: [],
    }

    unmounted = false

    async componentDidMount() {
        const stream = await getStream(this.props.value)

        if (this.unmounted) { return }

        /* eslint-disable-next-line react/no-did-mount-set-state */
        this.setState({
            search: stream.name,
        })
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    onFocus = (e: any) => {
        const { onFocus } = this.props
        const { search } = this.state

        this.setState({
            isOpen: true,
        })
        if (onFocus) {
            onFocus(e)
        }
        this.search(search)
    }

    onBlur = (e: any) => {
        const { onBlur } = this.props
        this.setState({
            isOpen: false,
        })
        if (onBlur) {
            onBlur(e)
        }
    }

    onChange = async (e: SyntheticInputEvent<EventTarget>) => {
        const { value } = e.target
        this.search(value)
    }

    search = async (search: string) => {
        this.setState({
            search,
        })

        const params = {
            id: '',
            search,
            sortBy: 'lastUpdated',
            order: 'desc',
            uiChannel: false,
            public: true,
        }
        const streams = await getStreams(params)

        if (this.unmounted) { return }

        this.setState({
            matchingStreams: streams,
        })
    }

    onStreamClick = (id: string) => {
        const { onChange } = this.props
        this.setState({
            isOpen: false,
        })
        onChange(id)
    }

    render() {
        const { disabled, className } = this.props
        const { isOpen, search, matchingStreams } = this.state

        return (
            <div
                role="textbox"
                className={styles.StreamSelector}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                tabIndex="0"
            >
                <input
                    className={className}
                    value={search}
                    disabled={disabled}
                    onChange={this.onChange}
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
                            >
                                <div>{stream.name}</div>
                                {stream.description && (
                                    <div className={styles.description}>{stream.description}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }
}
