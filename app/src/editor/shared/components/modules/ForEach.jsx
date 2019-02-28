import React, { Fragment } from 'react'
import cx from 'classnames'

import portStyles from '$editor/canvas/components/Ports.pcss'
import { ModalContainer } from '$editor/shared/components/Modal'
import SvgIcon from '$shared/components/SvgIcon'
import ModuleSubscription from '../ModuleSubscription'
import { getCanvasPort } from './Canvas'

import canvasStyles from './Canvas.pcss'
import styles from './ForEach.pcss'

export default class ForEachModule extends React.Component {
    subscription = React.createRef()

    state = {
        selectedKey: undefined,
    }

    onLoad = async ({ json: { canvasKeys } }) => {
        this.setState((prevState) => ({
            selectedKey: (prevState.selectedKey && canvasKeys[prevState.selectedKey]) || 0,
        }))
    }

    onSubCanvasSelect = (event) => {
        const { value } = event.target

        this.setState({
            selectedKey: value,
        })
    }

    render() {
        const { module, isActive } = this.props
        const { selectedKey } = this.state
        const currentCanvasPort = getCanvasPort(module)
        const selectedSubCanvas = module.canvasKeys[selectedKey] || null
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
                {isActive && currentCanvasPort && currentCanvasPort.value && (
                    <Fragment>
                        {canvasKeys.length <= 0 && (
                            <div className={styles.emptyState}>
                                No subcanvases. Click the <SvgIcon name="refresh" className={styles.reloadIcon} /> icon to reload.
                            </div>
                        )}
                        {canvasKeys.length > 0 && (
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
                                                value={selectedKey}
                                                onChange={this.onSubCanvasSelect}
                                                className={portStyles.portValue}
                                            >
                                                {(canvasKeys || []).map((name, index) => (
                                                    <option value={index} key={name}>
                                                        {name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {selectedSubCanvas && (
                                    <div className={cx(canvasStyles.link, styles.button)}>
                                        <ModalContainer modalId="SubCanvasDialog">
                                            {({ api }) => (
                                                <button
                                                    type="button"
                                                    className={canvasStyles.button}
                                                    onClick={() => api.open({
                                                        moduleHash: module.hash,
                                                        subCanvasKey: selectedSubCanvas,
                                                    })}
                                                >
                                                    View Canvas
                                                </button>
                                            )}
                                        </ModalContainer>
                                    </div>
                                )}
                            </Fragment>
                        )}
                    </Fragment>
                )}
            </div>
        )
    }
}
