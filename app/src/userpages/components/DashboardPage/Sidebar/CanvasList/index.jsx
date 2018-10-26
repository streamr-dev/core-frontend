// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'

import type { Canvas } from '$userpages/flowtype/canvas-types'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import { selectOpenDashboard } from '$userpages/modules/dashboard/selectors'
import styles from './canvasList.pcss'
import CanvasInList from './CanvasInList'

type StateProps = {
    canvases: Array<Canvas>,
    showCanvases: boolean
}

type Props = StateProps

export class CanvasList extends Component<Props> {
    render() {
        return this.props.showCanvases ? (
            <ul className="navigation">
                <li className={styles.canvasListTitle}>
                    Running Canvases
                </li>
                {this.props.canvases.filter((canvas) => canvas.state === 'RUNNING').map((canvas) => (
                    <CanvasInList key={canvas.id} canvas={canvas} />
                ))}
            </ul>
        ) : null
    }
}

export const mapStateToProps = (state: StoreState): StateProps => {
    const db = selectOpenDashboard(state) || {}
    const canWrite = db.ownPermissions ? db.ownPermissions.includes('write') : false
    return {
        canvases: state.canvas.list || [],
        showCanvases: db.new || canWrite,
    }
}

export default connect(mapStateToProps)(CanvasList)
