import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import links from '../../../../links'

import ButtonStyles from '$shared/components/Button/button.pcss'
import styles from './Button.pcss'

const getCanvasPort = ({ params }) => params.find(({ name }) => name === 'canvas')

export default class CanvasModule extends React.Component {
    render() {
        const { module, className } = this.props
        const currentCanvasPort = getCanvasPort(module)

        return (
            <div className={cx(className, styles.Button)}>
                {currentCanvasPort && currentCanvasPort.value != null && (
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
