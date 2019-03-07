// @flow

import React from 'react'
import { connect } from 'react-redux'
import startCase from 'lodash/startCase'

import type { Stream } from '$shared/flowtype/stream-types'
import type { Filter } from '$userpages/flowtype/common-types'

import { getStreams, updateFilter } from '$userpages/modules/userPageStreams/actions'
import { selectStreams } from '$userpages/modules/userPageStreams/selectors'

import { getModuleTree } from '../services'
import { moduleTreeSearch } from '../state'

import styles from './ModuleSearch.pcss'

export type OwnProps = {
    isOpen: boolean,
    open: (open: boolean) => void,
    addModule: (module: Object) => void,
}

export type StateProps = {
    streams: Array<Stream>,
}

export type DispatchProps = {
    getStreams: () => void,
    updateFilter: (filter: Filter) => void,
}

type Props = OwnProps & StateProps & DispatchProps

type State = {
    search: string,
    matchingModules: Array<Object>,
}

export class ModuleSearch extends React.PureComponent<Props, State> {
    state = {
        search: '',
        matchingModules: [],
    }

    allModules = []
    unmounted = false
    input = null

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
        this.load()
    }

    componentWillUnmount() {
        this.unmounted = true
        window.removeEventListener('keydown', this.onKeyDown)
    }

    async load() {
        const modules = await getModuleTree()
        this.allModules = modules
        if (this.unmounted) { return }
        this.setState({
            // Default to showing all modules
            matchingModules: moduleTreeSearch(this.allModules, ''),
        })
    }

    onChange = (event: any) => {
        const { value } = event.currentTarget

        // Search modules
        const matchingModules = moduleTreeSearch(this.allModules, value)
        this.setState({
            search: value,
            matchingModules,
        })

        // Search streams
        this.props.updateFilter({
            id: '',
            search: value,
            sortBy: 'lastUpdated',
            order: 'desc',
            uiChannel: false,
            public: true,
        })
        this.props.getStreams()
    }

    onSelect = (id: string) => {
        this.props.open(false)
        this.props.addModule({ id })
    }

    onSelectStream = (id: string) => {
        this.props.open(false)
        const configuration = {
            params: [
                {
                    name: 'stream',
                    value: id,
                },
            ],
        }
        this.props.addModule({
            // 147 is the id of Stream module
            id: 147,
            configuration,
        })
    }

    onKeyDown = (event: any) => {
        if (this.props.isOpen && event.key === 'Escape') {
            this.props.open(false)
        }
    }

    onInputRef = (el: any) => {
        this.input = el
    }

    componentDidUpdate(prevProps: Props) {
        // focus input on open
        if (this.props.isOpen && !prevProps.isOpen) {
            if (this.input) {
                this.input.focus()
            }
        }
    }

    render() {
        const { streams, open, isOpen } = this.props
        const { matchingModules, search } = this.state
        return (
            <React.Fragment>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div className={styles.Overlay} onClick={() => open(false)} hidden={!isOpen} />
                <div className={styles.ModuleSearch} hidden={!isOpen}>
                    <div className={styles.Header}>
                        <button onClick={() => open(false)}>X</button>
                    </div>
                    <div className={styles.Input}>
                        <input ref={this.onInputRef} placeholder="Search for modules and streams" value={search} onChange={this.onChange} />
                    </div>
                    <div role="listbox" className={styles.Content}>
                        {streams.length > 0 && matchingModules.length > 0 && (
                            <div className={styles.Category}>Modules</div>
                        )}
                        {matchingModules.map((m) => (
                            /* TODO: follow the disabled jsx-a11y recommendations below to add keyboard support */
                            /* eslint-disable-next-line */
                            <div className={styles.ModuleItem} role="option" key={m.id} onClick={() => this.onSelect(m.id)}>
                                {startCase(m.name)}
                                <span className={styles.ModuleCategory}>{m.path}</span>
                            </div>
                        ))}
                        {streams.length > 0 && matchingModules.length > 0 && (
                            <div className={styles.Category}>Streams</div>
                        )}
                        {streams.map((stream) => (
                            /* eslint-disable-next-line */
                            <div className={styles.StreamItem} role="option" key={stream.id} onClick={() => this.onSelectStream(stream.id)}>
                                {stream.name}
                                <div className={styles.Description}>{stream.description || 'No description'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    streams: selectStreams(state),
})

const mapDispatchToProps = (dispatch) => ({
    getStreams: () => dispatch(getStreams()),
    updateFilter: (filter) => dispatch(updateFilter(filter)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModuleSearch)
