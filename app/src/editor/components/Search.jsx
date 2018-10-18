import React from 'react'
import startCase from 'lodash/startCase'

import * as API from '$shared/utils/api'
import styles from './Search.pcss'

const apiUrl = `${process.env.STREAMR_URL}/module/jsonGetModuleTree`

function indexModules(modules = [], path = [], index = []) {
    modules.forEach((m) => {
        if (m.metadata.canAdd) {
            index.push({
                id: m.metadata.id,
                name: m.data,
                path: path.join(', '),
            })
        }
        if (m.children && m.children.length) {
            indexModules(m.children, path.concat(m.data), index)
        }
    })
    return index
}

function searchModules(moduleIndex, search) {
    search = search.trim().toLowerCase()
    if (!search) { return moduleIndex }
    const nameMatches = moduleIndex.filter((m) => (
        m.name.toLowerCase().includes(search)
    ))
    const found = new Set(nameMatches.map(({ id }) => id))
    const pathMatches = moduleIndex.filter((m) => (
        m.path.toLowerCase().includes(search) && !found.has(m.id)
    ))
    return nameMatches.concat(pathMatches)
}

export default class ModuleSearch extends React.PureComponent {
    state = {
        search: '',
        modules: [],
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
        this.load()
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    async load() {
        const modules = await API.get(apiUrl)
        this.setState({
            modules: indexModules(modules),
        })
    }

    onChange = (event) => {
        const { value } = event.currentTarget
        this.setState({ search: value })
    }

    onSelect = (id) => {
        this.props.open(false)
        this.props.addModule({ id })
    }

    onKeyDown = (event) => {
        if (this.props.isOpen && event.key === 'Escape') {
            this.props.open(false)
        }
    }

    onInputRef = (el) => {
        this.input = el
    }

    componentDidUpdate(prevProps) {
        // focus input on open
        if (this.props.isOpen && !prevProps.isOpen) {
            if (this.input) {
                this.input.focus()
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div className={styles.Overlay} onClick={() => this.props.open(false)} hidden={!this.props.isOpen} />
                <div className={styles.Search} hidden={!this.props.isOpen}>
                    <div className={styles.Header}>
                        <button onClick={() => this.props.open(false)}>X</button>
                    </div>
                    <div className={styles.Input}>
                        <input ref={this.onInputRef} placeholder="Search or select a module" value={this.state.search} onChange={this.onChange} />
                    </div>
                    <div role="listbox" className={styles.Content}>
                        {searchModules(this.state.modules, this.state.search).map((m) => (
                            /* TODO: follow the disabled jsx-a11y recommendations below to add keyboard support */
                            /* eslint-disable-next-line */
                            <div role="option" key={m.id} onClick={() => this.onSelect(m.id)}>
                                {startCase(m.name)}
                            </div>
                        ))}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
