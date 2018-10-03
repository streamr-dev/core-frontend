import React from 'react'
import startCase from 'lodash/startCase'

import * as API from '../../userpages/utils/api'
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
        this.load()
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
        this.props.showModuleSearch(false)
        this.props.addModule({ id })
    }

    render() {
        return (
            <div className={styles.Search} hidden={!this.props.show}>
                <div className={styles.Header}>
                    <button onClick={() => this.props.showModuleSearch(false)}>X</button>
                </div>
                <div className={styles.Input}>
                    <input placeholder="Search or select a module" value={this.state.search} onChange={this.onChange} />
                </div>
                <div role="listbox" className={styles.Content}>
                    {searchModules(this.state.modules, this.state.search).map((m) => (
                        /* eslint-disable-next-line */
                        <div role="option" key={m.id} onClick={() => this.onSelect(m.id)}>
                            {startCase(m.name)}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
