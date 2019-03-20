// @flow

import React from 'react'
import startCase from 'lodash/startCase'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'

import { getModuleCategories, getStreams } from '../services'
import { moduleSearch } from '../state'

import styles from './ModuleSearch.pcss'

type CategoryType = {
    name: string,
    modules: Array<Object>,
}

const categoryMapping = {
    'Utils, Color': 'Utils',
    'Time Series, Time Series Utils': 'Time Series, Utils',
}

type MenuCategoryProps = {
    category: CategoryType,
    onItemSelect: (id: string) => void,
}

type MenuCategoryState = {
    isExpanded: boolean,
}

export class ModuleMenuCategory extends React.PureComponent<MenuCategoryProps, MenuCategoryState> {
    state = {
        isExpanded: false,
    }

    toggle = () => {
        this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }))
    }

    render() {
        const { category, onItemSelect } = this.props
        const { isExpanded } = this.state
        return (
            <React.Fragment>
                {/* eslint-disable-next-line */}
                <div
                    className={cx(styles.Category, {
                        [styles.active]: !!isExpanded,
                    })}
                    key={category.name}
                    onClick={() => this.toggle()}
                >
                    {category.name}
                </div>
                {isExpanded && category.modules.map((m) => (
                    <ModuleMenuItem key={m.id} module={m} onSelect={onItemSelect} />
                ))}
            </React.Fragment>
        )
    }
}

const ModuleMenuItem = ({ module, onSelect }) => (
    /* eslint-disable-next-line */
    <div className={styles.ModuleItem} role="option" onClick={() => onSelect(module.id)}>
        {startCase(module.name)}
    </div>
)

type Props = {
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
        })
    }

    onChange = async (event: any) => {
        const { value } = event.currentTarget

        // Search modules
        const matchingModules = this.getMappedModuleTree(value)

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

    getMappedModuleTree = (search: string) => {
        const { allModules } = this.state
        const modules = moduleSearch(allModules, search)
            .sort((a, b) => (a.path ? a.path.localeCompare(b.path) : 0))

        const mapKeys = Object.keys(categoryMapping)

        modules.forEach((m) => {
            if (mapKeys.includes(m.path)) {
                const newPath = categoryMapping[m.path]
                m.path = newPath
                m.pathArray = this.mapPathStringToArray(newPath)
            }
        })

        return modules
    }

    mapPathStringToArray = (pathString: string) => (
        pathString.split(', ')
    )

    mapPathArrayToString = (pathArray: Array<string>) => (
        pathArray.join(': ')
    )

    renderMenu = () => {
        const modules = this.getMappedModuleTree('')

        // Form category tree
        const categoryTree: { [string]: CategoryType } = {}
        modules.forEach((m) => {
            if (categoryTree[m.path] == null) {
                categoryTree[m.path] = {
                    name: m.path,
                    modules: [m],
                }
            } else {
                categoryTree[m.path].modules.push(m)
            }
        })
        // https://github.com/facebook/flow/issues/2221
        // $FlowFixMe Object.values() returns mixed[]
        const categories: Array<CategoryType> = Object.values(categoryTree)

        // $FlowFixMe "Missing type annotation for U"
        return categories.map((category) => (
            <React.Fragment key={category.name}>
                <ModuleMenuCategory category={category} onItemSelect={this.onSelect} />
            </React.Fragment>
        ))
    }

    renderSearchResults = () => {
        const { matchingModules, matchingStreams } = this.state
        return (
            <React.Fragment>
                {matchingModules.length > 0 && (
                    <div className={styles.SearchCategory}>Modules</div>
                )}
                {matchingModules.map((m) => (
                    /* TODO: follow the disabled jsx-a11y recommendations below to add keyboard support */
                    /* eslint-disable-next-line */
                    <div className={styles.ModuleItem} role="option" key={m.id} onClick={() => this.onSelect(m.id)}>
                        {startCase(m.name)}
                        <span className={styles.ModuleCategory}>{this.mapPathArrayToString(m.pathArray)}</span>
                    </div>
                ))}
                {matchingStreams.length > 0 && (
                    <div className={styles.SearchCategory}>Streams</div>
                )}
                {matchingStreams.map((stream) => (
                    /* eslint-disable-next-line */
                    <div className={styles.StreamItem} role="option" key={stream.id} onClick={() => this.onSelectStream(stream.id)}>
                        {stream.name}
                        <div className={styles.Description}>{stream.description || 'No description'}</div>
                    </div>
                ))}
            </React.Fragment>
        )
    }

    render() {
        const { open, isOpen } = this.props
        const { search } = this.state
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
                        {(search && search.length > 0) ?
                            this.renderSearchResults() :
                            this.renderMenu()}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ModuleSearch
