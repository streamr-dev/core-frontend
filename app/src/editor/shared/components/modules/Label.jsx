import React from 'react'
import cx from 'classnames'
import throttle from 'lodash/throttle'

import ModuleSubscription from '../ModuleSubscription'
import styles from './Label.pcss'

export default class CommentModule extends React.Component {
    state = {
        value: '',
    }

    onMessage = throttle(({ value }) => {
        this.setState({
            value,
        })
    }, 250)

    render() {
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
            <div className={cx(this.props.className, styles.Label)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    module={module}
                    onMessage={this.onMessage}
                />
                {this.state.value}
            </div>
        )
    }
}
