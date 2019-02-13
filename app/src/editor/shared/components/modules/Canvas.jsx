import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import ModuleSubscription from '../ModuleSubscription'
import { getModule } from '../../services'
import links from '../../../../links'

import ButtonStyles from '$shared/components/Button/button.pcss'
import styles from './Button.pcss'

const getCanvasPort = ({ params }) => params.find(({ name }) => name === 'canvas')

export default class CanvasModule extends React.Component {
    async loadNewDefinition() {
        const { module } = this.props
        const newModule = await getModule(module)
        this.props.api.replaceModule(this.props.moduleHash, newModule)
    }

    componentDidUpdate(prevProps) {
        const prevCanvasPort = getCanvasPort(prevProps.module)
        const currentCanvasPort = getCanvasPort(this.props.module)
        if (prevCanvasPort.value !== currentCanvasPort.value) {
            this.loadNewDefinition()
        }
    }

    render() {
        const { isActive, module } = this.props
        const currentCanvasPort = getCanvasPort(this.props.module)

        return (
            <div className={cx(this.props.className, styles.Button)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    module={module}
                    onMessage={this.onMessage}
                />
                {isActive && currentCanvasPort && currentCanvasPort.value && (
                    <Link
                        className={styles.button}
                        to={`${links.editor.canvasEditor}/${currentCanvasPort.value}`}
                    >
                        <button className={cx(styles.button, ButtonStyles.btn, ButtonStyles.btnPrimary)}>
                            View Canvas
                        </button>
                    </Link>
                )}
            </div>
        )
    }
}
