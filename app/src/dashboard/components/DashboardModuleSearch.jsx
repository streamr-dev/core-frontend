import React from 'react'
import startCase from 'lodash/startCase'
import groupBy from 'lodash/groupBy'
import cx from 'classnames'

import { getCanvases } from '../services'
import { dashboardModuleSearch } from '../state'

import Modal from './Modal'
import styles from './DashboardModuleSearch.pcss'

class DashboardModuleSearch extends React.PureComponent {
    state = {
        search: '',
        canvases: [],
    }

    componentDidMount() {
        this.load()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    async load() {
        const canvases = await getCanvases()
        if (this.unmounted) { return }
        this.setState({ canvases })
    }

    onChange = (event) => {
        const { value } = event.currentTarget
        this.setState({ search: value })
    }

    onSelect = (canvasId, module) => {
        this.props.modalApi.close()
        const dashboardItem = this.findDashBoardItem(canvasId, module)
        if (!dashboardItem) {
            this.props.addModule(canvasId, module)
        } else {
            this.props.removeModule(dashboardItem)
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

    isOnDashboard = (...args) => (
        !!this.findDashBoardItem(...args)
    )

    findDashBoardItem = (canvasId, module) => {
        const { dashboard } = this.props
        return dashboard.items.find((m) => m.module === module.hash && m.canvas === canvasId)
    }

    hasCanvasModulesOnDashboard = (canvas) => {
        const { dashboard } = this.props
        return !!dashboard.items.find((m) => m.canvas === canvas.id)
    }

    render() {
        const { isOpen, modalApi, dashboard } = this.props
        if (!dashboard) { return null }
        const availableDashboardModules = groupBy(dashboardModuleSearch(this.state.canvases, this.state.search), 'canvasId')
        return (
            <React.Fragment>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div className={styles.ModuleSearch} hidden={!isOpen}>
                    <div className={styles.Header}>
                        <button onClick={() => modalApi.close()}>X</button>
                    </div>
                    <div className={styles.Input}>
                        <input ref={this.onInputRef} placeholder="Search or select a module" value={this.state.search} onChange={this.onChange} />
                    </div>
                    <div className={styles.Content}>
                        {Object.entries(availableDashboardModules).map(([canvasId, modules]) => {
                            const canvas = this.state.canvases.find(({ id }) => id === canvasId)
                            return (
                                <div
                                    key={canvas.id}
                                    role="listbox"
                                    className={cx(styles.CanvasGroup, { [styles.isOnDashboard]: this.hasCanvasModulesOnDashboard(canvas) })}
                                >
                                    <div className={styles.CanvasName}>
                                        {canvas.name}
                                    </div>
                                    <div className={styles.CanvasModules}>
                                        {modules.map((m) => {
                                            const isOnDashboard = this.isOnDashboard(canvas.id, m)
                                            return (
                                                /* TODO: follow the disabled jsx-a11y recommendations below to add keyboard support */
                                                /* eslint-disable-next-line */
                                                <div
                                                    role={'option' /* eslint-disable-line */}
                                                    onClick={() => this.onSelect(canvas.id, m)}
                                                    className={cx(styles.UIModule, { [styles.isOnDashboard]: isOnDashboard })}
                                                    key={m.hash}
                                                >
                                                    <div className={styles.Circle} />
                                                    {startCase(m.name)}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default (props) => (
    <Modal modalId="DashboardModuleSearch">
        {({ api, value }) => (
            <DashboardModuleSearch isOpen={value} modalApi={api} {...props} />
        )}
    </Modal>
)
