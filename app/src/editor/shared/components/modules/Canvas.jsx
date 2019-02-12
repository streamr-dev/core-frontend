import React from 'react'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'

export default class CanvasModule extends React.Component {
    onMessage = () => {
        debugger
    }

    onChange = () => {
        debugger
    }

    render() {
        const { isActive } = this.props
        let { module } = this.props
        module = Object.assign({}, module, {
            options: {
                ...module.options,
                uiResendLast: {
                    value: 1,
                },
            },
        })

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
