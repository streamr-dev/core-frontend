/**
 * Popup canvas/module searcher for adding new items to a dashboard.
 */

import React from 'react'
import startCase from 'lodash/startCase'
import groupBy from 'lodash/groupBy'
import cx from 'classnames'

import Modal from '$editor/shared/components/Modal'
import SearchPanel, { SearchRow } from '$editor/shared/components/SearchPanel'
import CanvasStyles from '$editor/canvas/components/Canvas.pcss'
import CanvasModuleSearchStyles from '$editor/canvas/components/ModuleSearch.pcss'

import { getCanvases } from '../services'
import { dashboardModuleSearch } from '../state'

import styles from './DashboardModuleSearch.pcss'

class DashboardModuleSearchItem extends React.PureComponent {
    state = {
        isExpanded: false,
    }

    toggle = () => {
        this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }))
    }

    render() {
        const { canvas, modules } = this.props
        return (
            <React.Fragment>
                <SearchRow
                    className={cx(styles.CanvasName, CanvasModuleSearchStyles.SearchCategory, {
                        [styles.isOnDashboard]: this.props.hasCanvasModulesOnDashboard(canvas),
                    })}
                    onClick={this.toggle}
                >
                    {canvas.name}
                </SearchRow>
                {!!this.state.isExpanded && modules.map((m) => {
                    const isOnDashboard = this.props.isOnDashboard(canvas.id, m)
                    return (
                        /* TODO: follow the disabled jsx-a11y recommendations below to add keyboard support */
                        /* eslint-disable-next-line */
                        <SearchRow
                            key={m.hash}
                            onClick={() => this.props.onSelect(canvas.id, m)}
                            className={cx(styles.UIModule, { [styles.isOnDashboard]: isOnDashboard })}
                        >
                            <div className={styles.Circle} />
                            {startCase(m.name)}
                        </SearchRow>
                    )
                })}
            </React.Fragment>
        )
    }
}

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
        const dashboardItem = this.findDashboardItem(canvasId, module)
        if (!dashboardItem) {
            this.props.addModule(canvasId, module)
        } else {
            this.props.removeModule(dashboardItem)
        }
    }

    isOnDashboard = (...args) => (
        !!this.findDashboardItem(...args)
    )

    findDashboardItem = (canvasId, module) => {
        const { dashboard } = this.props
        return dashboard.items.find((m) => m.module === module.hash && m.canvas === canvasId)
    }

    hasCanvasModulesOnDashboard = (canvas) => {
        const { dashboard } = this.props
        return !!dashboard.items.find((m) => m.canvas === canvas.id)
    }

    render() {
        const { modalApi, dashboard } = this.props
        if (!dashboard) { return null }
        const availableDashboardModules = groupBy(dashboardModuleSearch(this.state.canvases, this.state.search), 'canvasId')
        return (
            <SearchPanel
                className={styles.ModuleSearch}
                bounds={`.${CanvasStyles.CanvasElements}`}
                placeholder="Search or select a module"
                onChange={this.onChange}
                isOpen
                open={modalApi.open}
            >
                {Object.entries(availableDashboardModules).map(([canvasId, modules]) => {
                    const canvas = this.state.canvases.find(({ id }) => id === canvasId)
                    return (
                        <DashboardModuleSearchItem
                            key={canvas.id}
                            canvas={canvas}
                            modules={modules}
                            onSelect={this.onSelect}
                            isOnDashboard={this.isOnDashboard}
                            hasCanvasModulesOnDashboard={this.hasCanvasModulesOnDashboard}
                        />
                    )
                })}
            </SearchPanel>
        )
    }
}

export default (props) => (
    <Modal modalId="DashboardModuleSearch">
        {({ api }) => (
            <DashboardModuleSearch modalApi={api} {...props} />
        )}
    </Modal>
)
