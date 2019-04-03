// @flow

import React from 'react'
import startCase from 'lodash/startCase'

import type { Stream } from '$shared/flowtype/stream-types'

import { getModuleCategories, getStreams } from '../services'
import { moduleSearch } from '../state'

import styles from './ModuleSearch.pcss'

export type Props = {
    isOpen: boolean,
    open: (open: boolean) => void,
    addModule: (module: Object) => void,
}

type State = {
    search: string,
    allModules: Array<Object>,
    matchingModules: Array<Object>,
    matchingStreams: Array<Stream>,
}

export class ModuleSearch extends React.PureComponent<Props, State> {
    state = {
        search: '',
        allModules: [],
        matchingModules: [],
        matchingStreams: [],
    }

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
        const modules = await getModuleCategories()
        if (this.unmounted) { return }
        this.setState({
            allModules: modules,
            // Default to showing all modules
            matchingModules: moduleSearch(modules, ''),
        })
    }

    onChange = async (event: any) => {
        const { value } = event.currentTarget

        // Search modules
        const matchingModules = moduleSearch(this.state.allModules, value)

        // Search streams
        const params = {
            id: '',
            search: value,
            sortBy: 'lastUpdated',
            order: 'desc',
            uiChannel: false,
            public: true,
        }
        const streams = await getStreams(params)

        if (this.unmounted) { return }
        this.setState({
            search: value,
            matchingModules,
            matchingStreams: streams,
        })
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
        const { open, isOpen } = this.props
        const { matchingModules, matchingStreams, search } = this.state
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
                        {matchingModules.length > 0 && (
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
                        {matchingStreams.length > 0 && (
                            <div className={styles.Category}>Streams</div>
                        )}
                        {matchingStreams.map((stream) => (
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

export default ModuleSearch
