/**
 * Popup canvas/module searcher for adding new items to a dashboard.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import startCase from 'lodash/startCase'
import groupBy from 'lodash/groupBy'
import cx from 'classnames'

import Modal from '$editor/shared/components/Modal'
import SearchPanel, { SearchRow } from '$editor/shared/components/SearchPanel'
import CanvasModuleSearchStyles from '$editor/canvas/components/ModuleSearch.pcss'

import { getCanvases } from '../services'
import { dashboardModuleSearch } from '../state'

import DashboardStyles from '../index.pcss'
import styles from './DashboardModuleSearch.pcss'

function DashboardModuleSearchItem({
    canvas,
    modules,
    matchesSearch,
    isOnDashboard,
    hasCanvasModulesOnDashboard,
    onSelect,
}) {
    const prevMatchesSearch = useRef(!!matchesSearch)
    const [isExpanded, setExpanded] = useState(!!matchesSearch)

    useEffect(() => {
        if (!!prevMatchesSearch.current === !!matchesSearch) { return }
        setExpanded(!!matchesSearch)

        prevMatchesSearch.current = !!matchesSearch
    }, [prevMatchesSearch, matchesSearch])

    const toggle = useCallback(() => setExpanded((s) => !s), [setExpanded])

    return (
        <React.Fragment>
            {/* canvas header */}
            <SearchRow
                className={cx(styles.CanvasName, CanvasModuleSearchStyles.SearchCategory, {
                    [styles.isOnDashboard]: hasCanvasModulesOnDashboard(canvas),
                })}
                onClick={toggle}
            >
                {canvas.name}
            </SearchRow>
            {/* rows of matching canvas modules */}
            {!!isExpanded && modules.map((m) => (
                <SearchRow
                    key={m.hash}
                    onClick={() => onSelect(canvas.id, m)}
                    className={cx(styles.UIModule, {
                        [styles.isOnDashboard]: isOnDashboard(canvas.id, m),
                    })}
                >
                    <div className={styles.Circle} />
                    {startCase(m.name)}
                </SearchRow>
            ))}
        </React.Fragment>
    )
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

    onChange = (search) => {
        this.setState({ search })
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
        const { search, canvases } = this.state
        if (!dashboard) { return null }
        const availableDashboardModules = groupBy(dashboardModuleSearch(canvases, search), 'canvasId')
        return (
            <SearchPanel
                className={styles.ModuleSearch}
                bounds={`.${DashboardStyles.Dashboard}`}
                placeholder="Search or select a module"
                onChange={this.onChange}
                isOpen
                open={modalApi.open}
            >
                {Object.entries(availableDashboardModules).map(([canvasId, modules]) => {
                    const canvas = canvases.find(({ id }) => id === canvasId)
                    return (
                        <DashboardModuleSearchItem
                            key={canvas.id}
                            canvas={canvas}
                            modules={modules}
                            onSelect={this.onSelect}
                            isOnDashboard={this.isOnDashboard}
                            hasCanvasModulesOnDashboard={this.hasCanvasModulesOnDashboard}
                            matchesSearch={!!search}
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
