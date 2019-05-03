import React, { Fragment } from 'react'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'
import Cell from '$editor/canvas/components/Ports/Port/Cell'
import Select from '$editor/canvas/components/Ports/Value/Select'

import ModuleSubscription from '../ModuleSubscription'
import canvasStyles from './Canvas.pcss'
import styles from './ForEach.pcss'

export default class ForEachModule extends React.Component {
    subscription = React.createRef()

    state = {
        selectedCanvas: undefined,
    }

    onLoad = async ({ json: { canvasKeys } }) => {
        this.setState((prevState) => ({
            selectedCanvas: prevState.selectedCanvas || (!!canvasKeys && canvasKeys[0]),
        }))
    }

    onSubCanvasSelect = (value) => {
        this.setSelectedCanvas(value)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isActive && !this.props.isActive) {
            this.clear()
        }

        if (this.props.isActive && this.state.selectedCanvas === undefined) {
            const canvasKeys = this.props.module.canvasKeys || []

            if (canvasKeys.length > 0) {
                this.setSelectedCanvas(canvasKeys[0])
            }
        }
    }

    setSelectedCanvas = (selectedCanvas) => {
        this.setState({
            selectedCanvas,
        })
    }

    clear() {
        this.setState({
            selectedCanvas: undefined,
        })
    }

    render() {
        const { module, isActive } = this.props
        const { selectedCanvas } = this.state
        const canvasKeys = module.canvasKeys || []

        return (
            <div className={cx(styles.ForEach, this.props.className)}>
                <ModuleSubscription
                    {...this.props}
                    loadOptions={{ type: 'json' }}
                    onLoad={this.onLoad}
                    onMessage={this.onMessage}
                    module={module}
                />
                {isActive && (
                    <Fragment>
                        {canvasKeys.length > 0 && (
                            <Fragment>
                                <div className={styles.canvasKeys}>
                                    <Cell
                                        className={styles.canvasKeysLabel}
                                    >
                                        Sub-Canvases
                                    </Cell>
                                    <Cell>
                                        <Select
                                            options={canvasKeys.map((name) => ({
                                                name,
                                                value: name,
                                            }))}
                                            value={selectedCanvas}
                                            title="Sub-Canvases"
                                            onChange={this.onSubCanvasSelect}
                                        />
                                    </Cell>
                                </div>
                                {selectedCanvas !== undefined && (
                                    <div className={cx(canvasStyles.link, styles.button)}>
                                        <button
                                            type="button"
                                            className={canvasStyles.button}
                                        >
                                            View Canvas
                                        </button>
                                    </div>
                                )}
                            </Fragment>
                        )}
                        {canvasKeys.length < 1 && (
                            <span>
                                Use <SvgIcon name="refresh" className={styles.icon} /> to update the list of canvases.
                            </span>
                        )}
                    </Fragment>
                )}
            </div>
        )
    }
}
