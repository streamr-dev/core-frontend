import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Layout from '$mp/components/Layout'

import { openCanvas } from '$userpages/modules/canvas/actions'
import { selectOpenCanvas } from '$userpages/modules/canvas/selectors'
import links from '../links'

import * as services from './services'

import * as CanvasState from './state'
import Canvas from './components/Canvas'
import CanvasToolbar from './components/Toolbar'
import ModuleSearch from './components/ModuleSearch'
import ModuleSidebar from './components/ModuleSidebar'
import UndoContainer from './components/UndoContainer'

import styles from './index.pcss'

const CanvasEdit = withRouter(class CanvasEdit extends Component {
    state = {
        moduleSearchIsOpen: false,
        moduleSidebarIsOpen: false,
    }

    setCanvas = (action, fn, done) => {
        this.props.pushHistory(action, (canvas) => (
            CanvasState.updateCanvas(fn(canvas))
        ), done)
    }

    moduleSearchOpen = (show = true) => {
        this.setState({
            moduleSearchIsOpen: !!show,
        })
    }

    moduleSidebarOpen = (show = true) => {
        this.setState({
            moduleSidebarIsOpen: !!show,
        })
    }

    selectModule = async ({ hash } = {}) => {
        this.setState(({ moduleSidebarIsOpen }) => ({
            selectedModuleHash: hash,
            // close sidebar if no selection
            moduleSidebarIsOpen: hash == null ? false : moduleSidebarIsOpen,
        }))
    }

    onKeyDown = (event) => {
        const hash = Number(event.target.dataset.modulehash)
        if (Number.isNaN(hash)) {
            return
        }

        if (event.code === 'Backspace' || event.code === 'Delete') {
            this.removeModule({ hash })
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
        this.init()
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    componentDidUpdate(prevProps) {
        if (this.props.canvas !== prevProps.canvas) {
            this.autosave()
        }
    }

    init() {
        this.props.replaceHistory((canvas) => (
            CanvasState.updateCanvas(canvas)
        ))
    }

    async autosave() {
        const canvas = await services.autosave(this.props.canvas)
        // redirect to new id if changed for whatever reason
        if (canvas && canvas.id !== this.props.canvas.id) {
            this.props.history.push(`${links.userpages.canvasEditor}/${canvas.id}`)
        }
    }

    removeModule = async ({ hash }) => {
        const action = { type: 'Remove Module' }
        this.setCanvas(action, (canvas) => (
            CanvasState.removeModule(canvas, hash)
        ))
    }

    addModule = async ({ id }) => {
        const action = { type: 'Add Module' }
        const moduleData = await services.addModule({ id })
        this.setCanvas(action, (canvas) => (
            CanvasState.addModule(canvas, moduleData)
        ))
    }

    duplicateCanvas = async () => {
        const newCanvas = await services.duplicateCanvas(this.props.canvas)
        this.props.history.push(`${links.userpages.canvasEditor}/${newCanvas.id}`)
    }

    deleteCanvas = async () => {
        await services.deleteCanvas(this.props.canvas)
        this.props.history.push(links.userpages.canvases)
    }

    newCanvas = async () => {
        const newCanvas = await services.create()
        this.props.history.push(`${links.userpages.canvasEditor}/${newCanvas.id}`)
    }

    renameCanvas = (name) => {
        this.setCanvas({ type: 'Rename Canvas' }, (canvas) => ({
            ...canvas,
            name,
        }))
    }

    renameModule = (hash, displayName) => {
        this.setCanvas({ type: 'Rename Module' }, (canvas) => (
            CanvasState.updateModule(canvas, hash, (module) => ({
                ...module,
                displayName,
            }))
        ))
    }

    setModuleOptions = (hash, options) => {
        this.setCanvas({ type: 'Set Module Options' }, (canvas) => (
            CanvasState.setModuleOptions(canvas, hash, options)
        ))
    }

    setRunTab = (runTab) => {
        this.setCanvas({ type: 'Set Run Tab' }, (canvas) => (
            CanvasState.updateCanvas(canvas, 'settings.editorState', (editorState = {}) => ({
                ...editorState,
                runTab,
            }))
        ))
    }

    setHistorical = ({ beginDate, endDate }) => {
        this.setCanvas({ type: 'Set Historical Range' }, (canvas) => (
            CanvasState.updateCanvas(canvas, 'settings', (settings = {}) => ({
                ...settings,
                beginDate,
                endDate,
            }))
        ))
    }

    setSaveState = (serializationEnabled) => {
        this.setCanvas({ type: 'Set Save State' }, (canvas) => (
            CanvasState.updateCanvas(canvas, 'settings', (settings = {}) => ({
                ...settings,
                serializationEnabled: String(!!serializationEnabled) /* legacy compatibility. it wants a string */,
            }))
        ))
    }

    render() {
        return (
            <div className={styles.CanvasEdit}>
                <Helmet>
                    <title>{this.props.canvas.name}</title>
                </Helmet>
                <Canvas
                    className={styles.Canvas}
                    canvas={this.props.canvas}
                    selectedModuleHash={this.state.selectedModuleHash}
                    selectModule={this.selectModule}
                    renameModule={this.renameModule}
                    moduleSidebarOpen={this.moduleSidebarOpen}
                    moduleSidebarIsOpen={this.state.moduleSidebarIsOpen}
                    setCanvas={this.setCanvas}
                />
                <CanvasToolbar
                    className={styles.CanvasToolbar}
                    canvas={this.props.canvas}
                    setCanvas={this.setCanvas}
                    renameCanvas={this.renameCanvas}
                    deleteCanvas={this.deleteCanvas}
                    newCanvas={this.newCanvas}
                    duplicateCanvas={this.duplicateCanvas}
                    moduleSearchIsOpen={this.state.moduleSearchIsOpen}
                    moduleSearchOpen={this.moduleSearchOpen}
                    setRunTab={this.setRunTab}
                    setHistorical={this.setHistorical}
                    setSaveState={this.setSaveState}
                />
                <ModuleSidebar
                    className={styles.ModuleSidebar}
                    isOpen={this.state.moduleSidebarIsOpen}
                    open={this.moduleSidebarOpen}
                    canvas={this.props.canvas}
                    selectedModuleHash={this.state.selectedModuleHash}
                    setModuleOptions={this.setModuleOptions}
                />
                <ModuleSearch
                    addModule={this.addModule}
                    isOpen={this.state.moduleSearchIsOpen}
                    open={this.moduleSearchOpen}
                />
            </div>
        )
    }
})

function mapStateToProps(state) {
    return {
        canvas: selectOpenCanvas(state),
    }
}

const mapDispatchToProps = {
    openCanvas,
}

const CanvasEditLoader = connect(mapStateToProps, mapDispatchToProps)(class CanvasEditLoader extends React.PureComponent {
    componentDidMount() {
        this.load()
    }

    async load() {
        if (this.props.match.params.id) {
            await this.props.openCanvas(this.props.match.params.id)
        }
    }

    render() {
        const { canvas } = this.props
        return (
            <UndoContainer initialState={canvas}>
                {({ pushHistory, replaceHistory, state: canvas }) => {
                    if (!canvas) { return null }
                    return (
                        <CanvasEdit
                            key={canvas.id + canvas.updated}
                            canvas={canvas}
                            pushHistory={pushHistory}
                            replaceHistory={replaceHistory}
                        />
                    )
                }}
            </UndoContainer>
        )
    }
})

export default withRouter((props) => (
    <Layout className={styles.layout} footer={false}>
        <CanvasEditLoader key={props.match.params.id} {...props} />
    </Layout>
))
