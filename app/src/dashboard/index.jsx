import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Layout from '$mp/components/Layout'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import UndoContainer, { UndoControls } from '$editor/components/UndoContainer'

import links from '../links'

import Dashboard from './components/Dashboard'
import DashboardToolbar from './components/Toolbar'
import * as DashboardState from './state'
import * as services from './services'
import { ModalProvider } from './components/Modal'
import { SelectionProvider } from './components/Selection'

import styles from './index.pcss'

class DashboardEdit extends Component {
    setDashboard = (action, fn, done) => {
        this.props.push(action, (dashboard) => {
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
        await services.autosave(dashboard)
    }

    removeModule = async ({ id }) => {
        const action = { type: 'Remove Module' }
        this.setDashboard(action, (dashboard) => (
            DashboardState.removeModule(dashboard, id)
        ))
    }

    addModule = async ({ id }) => {
        const action = { type: 'Add Module' }
        const moduleData = await services.addModule({ id })
        this.setDashboard(action, (dashboard) => (
            DashboardState.addModule(dashboard, moduleData)
        ))
    }

    duplicateDashboard = async () => {
        const { dashboard } = this.props
        const newDashboard = await services.duplicateDashboard(dashboard)
        this.props.history.push(`${links.userpages.dashboardEditor}/${newDashboard.id}`)
    }

    deleteDashboard = async () => {
        const { dashboard } = this.props
        await services.deleteDashboard(dashboard)
        this.props.history.push(links.userpages.dashboardes)
    }

    newDashboard = async () => {
        const newDashboard = await services.create()
        this.props.history.push(`${links.userpages.dashboardEditor}/${newDashboard.id}`)
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

                <Helmet>
                    <title>{dashboard.name}</title>
                </Helmet>
                <ModalProvider>
                    <SelectionProvider>
                        <Dashboard
                            className={styles.Dashboard}
                            dashboard={dashboard}
                            setDashboard={this.setDashboard}
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
}

const DashboardLoader = withRouter(withErrorBoundary(ErrorComponentView)(class DashboardLoader extends React.PureComponent {
    static contextType = UndoContainer.Context
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

    init() {
        const dashboard = this.context.state
        const currentId = dashboard && dashboard.id
        const dashboardId = currentId || this.props.match.params.id
        if (dashboardId && currentId !== dashboardId && this.state.isLoading !== dashboardId) {
            // load dashboard if needed and not already loading
            this.load(dashboardId)
        }
    }

    load = async (dashboardId) => {
        this.setState({ isLoading: dashboardId })
        const newDashboard = await services.loadDashboard({ id: dashboardId })
        // ignore result if unmounted or dashboard changed
        if (this.unmounted || this.state.isLoading !== dashboardId) { return }
        // replace/init top of undo stack with loaded dashboard
        this.context.replace(() => newDashboard)
        this.setState({ isLoading: false })
    }

    render() {
        if (!this.context.state) { return null }
        return this.props.children
    }
}))

const DashboardEditWrap = () => (
    <UndoContainer.Consumer>
        {({
            state: dashboard,
            history,
            pointer,
            push,
            replace,
        }) => (
            <DashboardEdit
                key={dashboard && dashboard.id + (history.length - pointer)}
                push={push}
                replace={replace}
                dashboard={dashboard}
            />
        )}
    </UndoContainer.Consumer>
)

export default withRouter((props) => (
    <Layout className={styles.layout} footer={false}>
        <UndoContainer key={props.match.params.id}>
            <UndoControls />
            <DashboardLoader>
                <DashboardEditWrap />
            </DashboardLoader>
        </UndoContainer>
    </Layout>
))

