// @flow

import React, { Component } from 'react'

import type { Canvas, CanvasModule } from '../../../../../../flowtype/canvas-types'
import ModuleInModuleList from './ModuleInModuleList'

type GivenProps = {
    modules: Array<CanvasModule>,
    canvasId: $ElementType<Canvas, 'id'>
}

type Props = GivenProps

export default class ModuleList extends Component<Props> {
    render() {
        const { modules, canvasId } = this.props
        return (
            <ul className="mmc-dropdown-delay animated fadeInLeft">
                {modules
                    .filter((m) => m.uiChannel)
                    .sort((a, b) => (a.name ? a.name.localeCompare(b.name) : 0))
                    .map((module) => (
                        <ModuleInModuleList key={module.hash} module={module} canvasId={canvasId} />
                    ))
                }
            </ul>
        )
    }
}
