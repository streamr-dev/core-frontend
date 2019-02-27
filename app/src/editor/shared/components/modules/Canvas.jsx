import React from 'react'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'
import { ModalContainer } from '$editor/shared/components/Modal'

import styles from './Canvas.pcss'

const getCanvasPort = ({ params }) => params.find(({ name }) => name === 'canvas')

export default class CanvasModule extends React.Component {
    subscription = React.createRef()

    render() {
        const { module, isActive } = this.props
        const currentCanvasPort = getCanvasPort(this.props.module)

        return (
            <div className={cx(this.props.className, styles.SubCanvas)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    module={module}
                />
                {isActive && currentCanvasPort && currentCanvasPort.value && (
                    <ModalContainer modalId="SubCanvasDialog">
                        {({ api }) => (
                            <button
                                type="button"
                                className={styles.button}
                                onClick={() => api.open({
                                    moduleHash: module.hash,
                                })}
                            >
                                View Canvas
                            </button>
                        )}
                    </ModalContainer>
                )}
            </div>
        )
    }
}
