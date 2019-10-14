import React, { Component, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Layout from '$shared/components/Layout'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import UndoControls from '$editor/shared/components/UndoControls'
import { Context as UndoContext, Provider as UndoContextProvider } from '$shared/components/UndoContextProvider'
import { ClientProvider } from '$editor/shared/components/Client'
import * as sharedServices from '$editor/shared/services'
import { Provider as ModalProvider } from '$shared/components/ModalContextProvider'
import { SelectionProvider } from '$editor/shared/hooks/useSelection'
import { Provider as PendingProvider } from '$shared/components/PendingContextProvider'
import { useAnyPending } from '$shared/hooks/usePending'
import CanvasStyles from '$editor/canvas/index.pcss'
import Sidebar from '$editor/shared/components/Sidebar'
import { handleLoadError } from '$auth/utils/loginInterceptor'

import links from '../../links'

import Dashboard from './components/Dashboard'
import DashboardToolbar from './components/Toolbar'
import DashboardModuleSearch from './components/DashboardModuleSearch'
import KeyboardShortcutsSidebar from './components/KeyboardShortcutsSidebar'

import * as DashboardState from './state'
import * as services from './services'

import styles from './index.pcss'

const DashboardEdit = withRouter(class DashboardEdit extends Component {
    state = {
        moduleSearchIsOpen: false,
        keyboardShortcutIsOpen: false,
    }

    setDashboard = (action, fn, done) => {
        this.props.push(action, (dashboard) => {
            const nextDashboard = fn(dashboard)
            if (nextDashboard === null || nextDashboard === dashboard) { return null }
            return nextDashboard
        }, done)
    }

    replaceDashboard = (fn, done) => {
        this.props.replace((dashboard) => {
            const nextDashboard = fn(dashboard)
            if (nextDashboard === null || nextDashboard === dashboard) { return null }
            return nextDashboard
        }, done)
    }

    onKeyDown = (event) => {
        const id = event.target.dataset.itemid
        if (!id) { return }
        if (event.code === 'Backspace' || event.code === 'Delete') {
            this.removeModule({ id })
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
        this.autosave()
    }

    componentWillUnmount() {
        this.unmounted = true
        window.removeEventListener('keydown', this.onKeyDown)
        this.autosave()
    }

    componentDidUpdate(prevProps) {
        if (this.props.dashboard !== prevProps.dashboard) {
            this.autosave()
        }
    }

    async autosave() {
        const { dashboard } = this.props
        if (this.isDeleted) { return } // do not autosave deleted dashboards
        await services.autosave(dashboard)
    }

    removeModule = async ({ id }) => {
        const action = { type: 'Remove Module' }
        this.setDashboard(action, (dashboard) => (
            DashboardState.removeModule(dashboard, id)
        ))
    }

    addModule = async ({ id, configuration }) => {
        const action = { type: 'Add Module' }
        const moduleData = await sharedServices.getModule({
            id,
            configuration,
        })
        if (this.unmounted) { return }
        this.setDashboard(action, (dashboard) => (
            DashboardState.addModule(dashboard, moduleData)
        ))
    }

    duplicateDashboard = async () => {
        const { dashboard } = this.props
        const newDashboard = await services.duplicateDashboard(dashboard)
        if (this.unmounted) { return }
        this.props.history.push(`${links.editor.dashboardEditor}/${newDashboard.id}`)
    }

    deleteDashboard = async () => {
        const { dashboard } = this.props
        this.isDeleted = true
        await services.deleteDashboard(dashboard)
        if (this.unmounted) { return }
        this.props.history.push(links.userpages.dashboards)
    }

    newDashboard = async () => {
        const newDashboard = await services.create()
        if (this.unmounted) { return }
        this.props.history.push(`${links.editor.dashboardEditor}/${newDashboard.id}`)
    }

    renameDashboard = (name) => {
        this.setDashboard({ type: 'Rename Dashboard' }, (dashboard) => ({
            ...dashboard,
            name,
        }))
    }

    renameModule = (hash, displayName) => {
        this.setDashboard({ type: 'Rename Module' }, (dashboard) => (
            DashboardState.updateModule(dashboard, hash, (module) => ({
                ...module,
                displayName,
            }))
        ))
    }

    addModule = (canvasId, module) => {
        this.setDashboard({ type: 'Add Module' }, (dashboard) => (
            DashboardState.addModule(dashboard, canvasId, module)
        ))
    }

    moduleSearchOpen = (show = true) => {
        this.setState({
            moduleSearchIsOpen: !!show,
        })
    }

    keyboardShortcutOpen = (show = true) => {
        this.setState({
            keyboardShortcutIsOpen: !!show,
        })
    }

    keyboardShortcutClose = () => {
        this.keyboardShortcutOpen(false)
    }

    render() {
        const { dashboard } = this.props
        return (
            <div className={styles.DashboardEdit}>
                <Helmet title={`${dashboard.name} | Streamr Core`} />
                <ModalProvider>
                    <Dashboard
                        className={styles.Dashboard}
                        dashboard={dashboard}
                        setDashboard={this.setDashboard}
                        replaceDashboard={this.replaceDashboard}
                    />
                    <DashboardToolbar
                        className={styles.DashboardToolbar}
                        dashboard={dashboard}
                        setDashboard={this.setDashboard}
                        renameDashboard={this.renameDashboard}
                        deleteDashboard={this.deleteDashboard}
                        newDashboard={this.newDashboard}
                        duplicateDashboard={this.duplicateDashboard}
                        addModule={this.addModule}
                        removeModule={this.removeModule}
                        moduleSearchIsOpen={this.state.moduleSearchIsOpen}
                        moduleSearchOpen={this.moduleSearchOpen}
                        keyboardShortcutOpen={this.keyboardShortcutOpen}
                    />
                    <Sidebar
                        className={CanvasStyles.ModuleSidebar}
                        isOpen={this.state.keyboardShortcutIsOpen}
                        onClose={this.keyboardShortcutClose}
                    >
                        <KeyboardShortcutsSidebar
                            onClose={this.keyboardShortcutClose}
                        />
                    </Sidebar>
                    <DashboardModuleSearch
                        isOpen={this.state.moduleSearchIsOpen}
                        open={this.moduleSearchOpen}
                        removeModule={this.removeModule}
                        addModule={this.addModule}
                        dashboard={dashboard}
                    />
                </ModalProvider>
            </div>
        )
    }
})

const DashboardLoader = withRouter(withErrorBoundary(ErrorComponentView)(class DashboardLoader extends React.PureComponent {
    static contextType = UndoContext
    state = { isLoading: false }

    componentDidMount() {
        this.init()
    }

    componentDidUpdate() {
        this.init()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    async init() {
        const { match, history } = this.props
        if (!match.params.id) {
            // if no id, create new
            const newDashboard = await services.create()
            if (this.unmounted) { return }
            history.replace(`${links.editor.dashboardEditor}/${newDashboard.id}`)
            return
        }

        const dashboard = this.context.state
        const currentId = dashboard && dashboard.id
        const dashboardId = currentId || match.params.id
        if (dashboardId && currentId !== dashboardId && this.state.isLoading !== dashboardId) {
            // load dashboard if needed and not already loading
            this.load(dashboardId)
        }
    }

    load = async (dashboardId) => {
        this.setState({ isLoading: dashboardId })
        let newDashboard
        try {
            newDashboard = await services.loadDashboard({ id: dashboardId })
        } catch (error) {
            // ignore result if unmounted or dashboard changed
            if (this.unmounted || this.state.isLoading !== dashboardId) { return }
            await handleLoadError(error)
            throw error
        } finally {
            if (!this.unmounted && this.state.isLoading === dashboardId) {
                this.setState({ isLoading: false })
            }
        }
        // replace/init top of undo stack with loaded dashboard
        this.context.replace(() => newDashboard)
    }

    render() {
        if (!this.context.state) {
            return (
                <div className={styles.DashboardEdit}>
                    <DashboardToolbar className={styles.DashboardToolbar} />
                </div>
            )
        }
        return this.props.children
    }
}))

const DashboardEditWrap = () => (
    <UndoContext.Consumer>
        {({ state: dashboard, push, replace }) => (
            <DashboardEdit
                key={dashboard.id}
                push={push}
                replace={replace}
                dashboard={dashboard}
            />
        )}
    </UndoContext.Consumer>
)

function DashboardLoadingIndicator() {
    const { state } = useContext(UndoContext)
    const isPending = useAnyPending()
    return (
        <LoadingIndicator className={styles.LoadingIndicator} loading={!state || isPending} />
    )
}

export default withRouter((props) => (
    <Layout className={styles.layout} footer={false}>
        <UndoContextProvider key={props.match.params.id} enableBreadcrumbs>
            <PendingProvider name="dashboard">
                <ClientProvider>
                    <DashboardLoadingIndicator />
                    <DashboardLoader>
                        <SelectionProvider>
                            <UndoControls />
                            <DashboardEditWrap />
                        </SelectionProvider>
                    </DashboardLoader>
                </ClientProvider>
            </PendingProvider>
        </UndoContextProvider>
    </Layout>
))

