// @flow

import React from 'react'
import startCase from 'lodash/startCase'
import cx from 'classnames'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'

import type { Stream } from '$shared/flowtype/stream-types'
import SvgIcon from '$shared/components/SvgIcon'

import { getModuleCategories, getStreams } from '../services'
import { moduleSearch } from '../state'

import styles from './ModuleSearch.pcss'

type CategoryType = {
    name: string,
    modules: Array<Object>,
}

const categoryMapping = {
    'Utils: Color': 'Utils',
    'Time Series: Time Series Utils': 'Time Series: Utils',
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
    isExpanded: boolean,
    height: number,
    width: number,
    heightBeforeMinimize: number,
}

const MIN_WIDTH = 250
const MAX_WIDTH = 450
const MIN_HEIGHT = 450
const MAX_HEIGHT = 700
const MIN_HEIGHT_MINIMIZED = 90
const MODULE_ITEM_HEIGHT = 52

export class ModuleSearch extends React.PureComponent<Props, State> {
    state = {
        search: '',
        allModules: [],
        matchingModules: [],
        matchingStreams: [],
        isExpanded: true,
        width: 250,
        height: MIN_HEIGHT,
        /* eslint-disable-next-line react/no-unused-state */
        heightBeforeMinimize: 0,
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
        this.setState({
            search: value,
        })

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
            matchingModules,
            matchingStreams: streams,
        }, () => this.recalculateHeight())
    }

    recalculateHeight = () => {
        const { isExpanded, matchingModules, matchingStreams, search } = this.state

        if (isExpanded) {
            this.setState(({ heightBeforeMinimize, height }) => ({
                height: heightBeforeMinimize > 0 ? heightBeforeMinimize : height,
            }))
            return
        }

        const searchResultItemCount = matchingModules.length + matchingStreams.length +
            (matchingModules.length > 0 ? 1 : 0) + // take headers into account
            (matchingStreams.length > 0 ? 1 : 0)
        let requiredHeight = MIN_HEIGHT_MINIMIZED + (searchResultItemCount * MODULE_ITEM_HEIGHT)

        if (search === '') {
            requiredHeight = 0
        }

        this.setState({
            height: Math.min(Math.max(requiredHeight, MIN_HEIGHT_MINIMIZED), MAX_HEIGHT),
        })
    }

    toggleMinimize = () => {
        this.setState(({ isExpanded, height, heightBeforeMinimize }) => ({
            isExpanded: !isExpanded,
            heightBeforeMinimize: isExpanded ? height : heightBeforeMinimize,
        }), () => this.recalculateHeight())
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

    getMappedModuleTree = (search: string = '') => {
        const { allModules } = this.state
        const modules = moduleSearch(allModules, search)
        const mapKeys = Object.keys(categoryMapping)

        modules.forEach((m) => {
            if (mapKeys.includes(m.path)) {
                const newPath = categoryMapping[m.path]
                m.path = newPath
            }
        })

        return modules.sort(this.compareModules)
    }

    // Used for sorting module list. Sorts first by path and then by name.
    compareModules = (a: any, b: any) => {
        if (a.path === b.path) {
            return a.name.localeCompare(b.name)
        }
        return a.path ? a.path.localeCompare(b.path) : 0
    }

    renderMenu = () => {
        if (!this.state.isExpanded) {
            return null
        }

        const modules = this.getMappedModuleTree()

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
                    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
                    <div
                        className={cx(styles.ModuleItem, styles.WithCategory)}
                        role="option"
                        aria-selected="false"
                        key={m.id}
                        onClick={() => this.onSelect(m.id)}
                        tabIndex="0"
                    >
                        <span className={styles.ModuleName}>{startCase(m.name)}</span>
                        <span className={styles.ModuleCategory}>{m.path}</span>
                    </div>
                ))}
                {matchingStreams.length > 0 && (
                    <div className={styles.SearchCategory}>Streams</div>
                )}
                {matchingStreams.map((stream) => (
                    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
                    <div
                        className={styles.StreamItem}
                        role="option"
                        aria-selected="false"
                        key={stream.id}
                        onClick={() => this.onSelectStream(stream.id)}
                        tabIndex="0"
                    >
                        {stream.name}
                        <div className={styles.Description}>{stream.description || 'No description'}</div>
                    </div>
                ))}
            </React.Fragment>
        )
    }

    render() {
        const { open, isOpen } = this.props
        const { search, isExpanded, width, height } = this.state
        const minHeight = isExpanded ? MIN_HEIGHT : MIN_HEIGHT_MINIMIZED
        return (
            <React.Fragment>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div className={styles.Overlay} onClick={() => open(false)} hidden={!isOpen} />
                <Draggable
                    handle={`.${styles.dragHandle}`}
                    bounds="parent"
                >
                    <div
                        className={styles.ModuleSearch}
                        hidden={!isOpen}
                    >
                        <ResizableBox
                            width={width}
                            height={height}
                            minConstraints={[MIN_WIDTH, minHeight]}
                            maxConstraints={[MAX_WIDTH, MAX_HEIGHT]}
                            onResize={(e, data) => {
                                this.setState({
                                    height: data.size.height,
                                    width: data.size.width,
                                })
                            }}
                        >
                            <div className={styles.Container}>
                                <div className={cx(styles.Header, styles.dragHandle)}>
                                    <button className={styles.minimize} onClick={() => this.toggleMinimize()}>
                                        {isExpanded ?
                                            <SvgIcon name="caretUp" /> :
                                            <SvgIcon name="caretDown" />
                                        }
                                    </button>
                                    <button className={styles.close} onClick={() => open(false)}>
                                        <SvgIcon name="crossHeavy" />
                                    </button>
                                </div>
                                <div className={styles.Input}>
                                    <input
                                        ref={this.onInputRef}
                                        placeholder="Search for modules and streams"
                                        value={search}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div role="listbox" className={styles.Content}>
                                    {(search && search.length > 0) ?
                                        this.renderSearchResults() :
                                        this.renderMenu()}
                                </div>
                            </div>
                        </ResizableBox>
                    </div>
                </Draggable>
            </React.Fragment>
        )
    }
}

export default ModuleSearch
