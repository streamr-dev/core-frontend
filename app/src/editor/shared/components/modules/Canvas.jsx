import React from 'react'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'
import { getModule } from '../../services'

export default class CanvasModule extends React.Component {
    onMessage = () => {
        debugger
    }

    async loadNewDefinition() {
        const { module } = this.props
        const newModule = await getModule(module)
        this.props.api.replaceModule(this.props.moduleHash, newModule)
    }

    componentDidUpdate(prevProps) {
        const getCanvas = ({ params }) => params.find(({ name }) => name === 'canvas')
        const prevCanvas = getCanvas(prevProps.module)
        const currentCanvas = getCanvas(this.props.module)
        if (prevCanvas.value !== currentCanvas.value) {
            this.loadNewDefinition()
        }
    }

    render() {
        const { isActive } = this.props
        const { module } = this.props

        return (

            <div className={cx(this.props.className)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    module={module}
                    onMessage={this.onMessage}
                />
                {isActive && (
                    <button>
                        View canvas
                    </button>
                )}
            </div>
        )
    }
}
