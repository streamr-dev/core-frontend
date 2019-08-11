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

import links from '../../links'

import Dashboard from './components/Dashboard'
import DashboardToolbar from './components/Toolbar'
import { ModalProvider } from '$editor/shared/components/Modal'
import { SelectionProvider } from './components/Selection'

import * as DashboardState from './state'
import * as services from './services'

import styles from './index.pcss'

const DashboardEdit = withRouter(class DashboardEdit extends Component {
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

    render() {
        const { dashboard } = this.props
        return (
            <div className={styles.DashboardEdit}>
                <Helmet title={`${dashboard.name} | Streamr Core`} />
                <ModalProvider>
                    <SelectionProvider>
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
                        />
                    </SelectionProvider>
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
            if (this.unmounted || this.state.isLoading !== dashboardId) { return }
            this.props.history.replace('/404')
            return
        }
        // ignore result if unmounted or dashboard changed
        if (this.unmounted || this.state.isLoading !== dashboardId) { return }
        // replace/init top of undo stack with loaded dashboard
        this.context.replace(() => newDashboard)
        this.setState({ isLoading: false })
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
    return (
        <LoadingIndicator className={styles.LoadingIndicator} loading={!state} />
    )
}

export default withRouter((props) => (
    <Layout className={styles.layout} footer={false}>
        <ClientProvider>
            <UndoContextProvider key={props.match.params.id}>
                <UndoControls />
                <DashboardLoadingIndicator />
                <DashboardLoader>
                    <DashboardEditWrap />
                </DashboardLoader>
            </UndoContextProvider>
        </ClientProvider>
    </Layout>
))

