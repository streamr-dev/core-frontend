import React, { Fragment } from 'react'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'

import portStyles from '$editor/canvas/components/Ports/ports.pcss'
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

    onSubCanvasSelect = (event) => {
        const { value } = event.target

        this.setState({
            selectedCanvas: value,
        })
    }

    render() {
        const { module, isActive } = this.props
        const { selectedCanvas } = this.state

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
                        <div className={cx(portStyles.ports, styles.ports)}>
                            <div className={portStyles.portRow} role="row">
                                <div className={portStyles.portNameContainer} role="gridcell">
                                    <span className={portStyles.portName}>
                                        Sub-Canvases
                                    </span>
                                </div>
                                <div className={cx(portStyles.portValueContainer, styles.portValueContainer)} role="gridcell">
                                    <select
                                        title="Sub-Canvases"
                                        value={selectedCanvas}
                                        onChange={this.onSubCanvasSelect}
                                        className={portStyles.portValue}
                                    >
                                        {(module.canvasKeys || []).map((name, index) => (
                                            <option value={index} key={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className={cx(canvasStyles.link, styles.button)}>
                            <button
                                type="button"
                                className={canvasStyles.button}
                            >
                                View Canvas
                            </button>
                        </div>
                    </Fragment>
                )}
            </div>
        )
    }
}
