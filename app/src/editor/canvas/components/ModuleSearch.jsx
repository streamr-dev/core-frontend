// @flow

// Need to use index-based keys otherwise transitions get messed up.
// With normal id-based keys and index-based selection higlight,
// the highlight will flicker when the item at same index changes selection state
/* eslint-disable react/no-array-index-key */

import React, { useState, useCallback } from 'react'
import startCase from 'lodash/startCase'
import debounce from 'lodash/debounce'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'
import SvgIcon from '$shared/components/SvgIcon'
import { type Ref } from '$shared/flowtype/common-types'
import { getModuleBoundingBox, findNonOverlappingPosition } from '$editor/shared/utils/boundingBox'

import { getModuleCategories, getStreams } from '../services'
import { moduleSearch } from '../state'
import CanvasStyles from '$editor/canvas/components/Canvas.pcss'
import SearchPanel, { SearchRow } from '$editor/shared/components/SearchPanel'

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
    addModule: (id: number, x: ?number, y: ?number, streamId: ?string) => void,
    disabled?: boolean,
}

export function ModuleMenuCategory(props: MenuCategoryProps) {
    const { category, addModule, disabled } = props
    const isDisabled = disabled || !category.modules.length // disable if no modules
    const [isExpanded, setIsExpanded] = useState(false)

    const toggle = useCallback(() => {
        setIsExpanded((isExpanded) => !isExpanded)
    }, [setIsExpanded])

    const onClick = useCallback(() => {
        if (isDisabled) { return }
        toggle()
    }, [isDisabled, toggle])

    return (
        <React.Fragment>
            {/* eslint-disable-next-line */}
            <SearchRow
                className={cx(styles.Category, {
                    [styles.active]: !!isExpanded,
                })}
                onClick={onClick}
                disabled={isDisabled}
            >
                {category.name}
            </SearchRow>
            {isExpanded && category.modules.map((m, index) => (
                <ModuleMenuItem module={m} key={index} addModule={addModule} />
            ))}
        </React.Fragment>
    )
}

const onDragStart = (e: any, moduleId: number, moduleName: string, streamId?: string) => {
    e.stopPropagation()
    const dragImage = document.querySelector('#dragElement')
    if (dragImage) {
        const textElement = dragImage.querySelector('#dragModuleName')
        if (textElement) {
            textElement.textContent = moduleName
        }
        e.dataTransfer.setDragImage(dragImage, 12, 12)
    }

    e.dataTransfer.setData('streamr/module', moduleId)
    if (streamId) {
        e.dataTransfer.setData('streamr/stream', streamId)
    }
}

const onDrop = (e: any, addModule: (number, number, number, ?string) => void) => {
    const moduleId = e.dataTransfer.getData('streamr/module')
    const streamId = e.dataTransfer.getData('streamr/stream')

    if (moduleId) {
        // Get click position relative to the canvas element
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left - 20 // TODO: where is this 20px offset coming
        const y = e.clientY - rect.top - 20 // TODO: where is this 20px offset coming

        addModule(moduleId, x, y, streamId)
    }
}

const ModuleMenuItem = ({ module, addModule }) => (
    <SearchRow
        draggable
        onDragStart={(e) => { onDragStart(e, module.id, module.name) }}
        onClick={() => addModule(module.id)}
        className={styles.ModuleItem}
    >
        {startCase(module.name)}
    </SearchRow>
)

type Props = {
    isOpen: boolean,
    open: (open: boolean) => void,
    addModule: (module: Object) => void,
    canvas: any,
}

type State = {
    search: string,
    allModules: Array<Object>,
    matchingModules: Array<Object>,
    matchingStreams: Array<Stream>,
}

const STREAM_MODULE_ID = 147

export class ModuleSearch extends React.PureComponent<Props, State> {
    state = {
        search: '',
        allModules: [],
        matchingModules: [],
        matchingStreams: [],
    }

    unmounted = false
    input = null
    currentSearch: string = ''
    selfRef: Ref<HTMLDivElement> = React.createRef()

    componentDidMount() {
        this.addOrRemoveDropListener(true)
        this.load()

        if (this.input && this.props.isOpen) {
            this.input.focus()
        }
    }

    componentWillUnmount() {
        this.unmounted = true
        this.addOrRemoveDropListener(false)
    }

    addOrRemoveDropListener= (add: boolean) => {
        const canvasElement = document.querySelector(`.${CanvasStyles.Modules}`)
        if (canvasElement) {
            if (add) {
                canvasElement.addEventListener('dragover', this.onDragOver)
                canvasElement.addEventListener('drop', this.onDrop)
            } else {
                canvasElement.removeEventListener('dragover', this.onDragOver)
                canvasElement.removeEventListener('drop', this.onDrop)
            }
        }
    }

    onDragOver = (e: DragEvent) => {
        e.preventDefault()
    }

    onDrop = (e: DragEvent) => {
        onDrop(e, this.addModule)
    }

    async load() {
        const modules = await getModuleCategories()
        if (this.unmounted) { return }
        this.setState({
            allModules: modules,
        })
    }

    searchStreams = debounce(async (value) => {
        // remove 'stream' term from search
        // ensures we can pseudo 'filter results to streams' using "stream searchterm"
        const streamSearchString = value.replace(/^streams?\s/g, ' ').trim()
        const params = {
            id: '',
            search: streamSearchString,
            sortBy: 'lastUpdated',
            order: 'desc',
            uiChannel: false,
            public: true,
        }

        const matchingStreams = await getStreams(params)

        if (this.unmounted) { return }
        // throw away results if no longer current
        if (this.currentSearch !== value) { return }

        this.setState({ matchingStreams })
    }, 500)

    onChange = async (value: string) => {
        const trimmedValue = value.trim().replace(/\s+/g, ' ') // trim & collapse whitespace
        this.currentSearch = trimmedValue

        // Search modules
        const matchingModules = this.getMappedModuleTree(trimmedValue)
        this.setState({
            matchingStreams: [],
            matchingModules,
            search: value,
        })

        this.searchStreams(trimmedValue)
    }

    addModule = (id: number, x: ?number, y: ?number, streamId: ?string) => {
        let posX = x
        let posY = y

        // Get default position if not provided
        if (posX == null || posY == null) {
            const modulePos = this.getPositionForClickInsert()
            posX = modulePos.x
            posY = modulePos.y
        }

        let configuration = {
            layout: {
                position: {
                    left: `${posX}px`,
                    top: `${posY}px`,
                },
            },
        }

        // Provide stream id for the Stream module
        if (streamId) {
            configuration = {
                ...configuration,
                params: [
                    {
                        name: 'stream',
                        value: streamId,
                    },
                ],
            }
        }

        this.props.addModule({
            id,
            configuration,
        })
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

        return modules
    }

    getPositionForClickInsert = () => {
        const canvasElement = document.querySelector(`.${CanvasStyles.Modules}`)

        if (this.selfRef.current == null || canvasElement == null) {
            return {
                x: 0,
                y: 0,
            }
        }

        const selfRect = this.selfRef.current.getBoundingClientRect()
        const canvasRect = canvasElement.getBoundingClientRect()

        const myBB = {
            // Align module to the top right corner of ModuleSearch with a 32px offset
            x: (selfRect.right - canvasRect.left - 20) + 32,
            y: selfRect.top - canvasRect.top - 20,
            // TODO: It would be nice to use actual module size here but we know
            //       it only after the module has been added to the canvas
            width: 100,
            height: 50,
        }

        const boundingBoxes = this.props.canvas.modules.map((m) => getModuleBoundingBox(m))

        const stackOffset = 16 // pixels
        return findNonOverlappingPosition(myBB, boundingBoxes, stackOffset)
    }

    renderMenu = () => {
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
            <ModuleMenuCategory
                key={category.name}
                category={category}
                addModule={this.addModule}
            />
        ))
    }

    renderSearchResults = () => {
        const { matchingModules, matchingStreams } = this.state
        return (
            <React.Fragment>
                {matchingModules.length > 0 && (
                    <SearchRow className={styles.SearchCategory} disabled>Modules</SearchRow>
                )}
                {matchingModules.map((m, index) => (
                    /* TODO: follow the disabled jsx-a11y recommendations below to add keyboard support */
                    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
                    <SearchRow
                        key={index}
                        className={cx(styles.ModuleItem, styles.WithCategory)}
                        draggable
                        onDragStart={(e) => { onDragStart(e, m.id, m.name) }}
                        onClick={() => this.addModule(m.id)}
                    >
                        <span className={styles.ModuleName}>{startCase(m.name)}</span>
                        <span className={styles.ModuleCategory}>{m.path}</span>
                    </SearchRow>
                ))}
                {matchingStreams.length > 0 && (
                    <SearchRow className={styles.SearchCategory} disabled>Streams</SearchRow>
                )}
                {matchingStreams.map((stream, index) => (
                    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
                    <SearchRow
                        key={index}
                        className={styles.StreamItem}
                        draggable
                        onDragStart={(e) => { onDragStart(e, STREAM_MODULE_ID, stream.name, stream.id) }}
                        onClick={() => this.addModule(STREAM_MODULE_ID, null, null, stream.id)}
                    >
                        {stream.name}
                        <div className={styles.Description}>{stream.description || 'No description'}</div>
                    </SearchRow>
                ))}
            </React.Fragment>
        )
    }

    render() {
        const { open, isOpen } = this.props
        const { search } = this.state
        const isSearching = !!search.trim()
        return (
            <React.Fragment>
                <SearchPanel
                    placeholder="Search for modules and streams"
                    className={styles.ModuleSearch}
                    bounds={`.${CanvasStyles.Modules}`}
                    onChange={this.onChange}
                    isOpen={isOpen}
                    open={open}
                    panelRef={this.selfRef}
                    resetOnDefault
                    renderDefault={() => this.renderMenu()}
                >
                    {!!isSearching && this.renderSearchResults()}
                </SearchPanel>
                <div className={styles.dragElement} id="dragElement">
                    <SvgIcon className={styles.dragImage} name="dropPlus" />
                    <div className={styles.dropText}>Drop to create</div>
                    <div className={styles.dragModuleName} id="dragModuleName" />
                </div>
            </React.Fragment>
        )
    }
}

export default ModuleSearch
