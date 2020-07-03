// @flow

import type { Canvas } from './canvas-types'
import type { Permission } from './permission-types'
import type { Webcomponent } from './webcomponent-types'

export type LayoutItem = {
    i: string | number,
    h: number,
    isDraggable: ?number,
    isResizable: ?number,
    maxH: ?number,
    maxW: ?number,
    minH: number,
    minW: number,
    moved: boolean,
    static: boolean,
    w: number,
    x: number,
    y: number
}

export type Layout = {
    xs?: Array<LayoutItem>,
    sm?: Array<LayoutItem>,
    md?: Array<LayoutItem>,
    lg?: Array<LayoutItem>
}

export type DashboardId = string
export type DashboardIdList = Array<DashboardId>

export type DashboardItem = {
    id: ?string,
    title: string,
    dashboard: ?DashboardId,
    module: number,
    canvas: $ElementType<Canvas, 'id'>,
    layout?: Layout,
    webcomponent: $ElementType<Webcomponent, 'type'>
}

export type Dashboard = {
    id: DashboardId,
    name: string,
    items: Array<DashboardItem>,
    editingLocked?: boolean,
    layout: Layout,
    new?: boolean,
    saved?: boolean
}

export type DashboardList = Array<Dashboard>

export type DashboardEntities = {
    [DashboardId]: Dashboard,
}
