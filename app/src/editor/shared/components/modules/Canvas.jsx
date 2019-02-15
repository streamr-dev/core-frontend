import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import ModuleSubscription from '../ModuleSubscription'
import links from '../../../../links'

import ButtonStyles from '$shared/components/Button/button.pcss'
import styles from './Button.pcss'

const getCanvasPort = ({ params }) => params.find(({ name }) => name === 'canvas')

export default class CanvasModule extends React.Component {
    render() {
        const { module } = this.props
        const currentCanvasPort = getCanvasPort(this.props.module)

        return (
            <div className={cx(this.props.className, styles.Button)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    module={module}
                    onMessage={this.onMessage}
                />
                {currentCanvasPort && currentCanvasPort.value && (
                    <Link
                        className={styles.button}
                        to={`${links.editor.canvasEditor}/${currentCanvasPort.value}`}
                    >
                        <button
                            type="button"
                            className={cx(styles.button, ButtonStyles.btn, ButtonStyles.btnPrimary)}
                        >
                            View Canvas
                        </button>
                    </Link>
                )}
            </div>
        )
    }
}
