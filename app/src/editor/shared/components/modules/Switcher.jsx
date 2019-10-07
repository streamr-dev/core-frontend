import React from 'react'
import cx from 'classnames'
import throttle from 'lodash/throttle'

import Toggle from '$shared/components/Toggle'
import ModuleSubscription from '../ModuleSubscription'
import styles from './Switcher.pcss'

export default class SwitcherModule extends React.Component {
    subscription = React.createRef()

    state = {}

    getValue = () => {
        let { value } = this.state
        if (value == null) {
            // use module value unless state set
            const { module } = this.props
            value = module.switcherValue
        }
        return value
    }

    onMessage = throttle(({ switcherValue: value }) => {
        this.setState({
            value,
        })
    }, 250)

    onChange = async (value) => {
        if (this.props.isActive) {
            this.sendValue(value)

            this.setState({
                value,
            })
        } else {
            this.props.api.updateModule(this.props.moduleHash, {
                switcherValue: value,
            })
        }
    }

    sendValue(value) {
        return this.subscription.current.send({
            type: 'uiEvent',
            value,
        })
    }

    onActiveChange = (isActive) => {
        if (isActive) {
            this.sendValue(this.getValue())
        } else {
            this.setState({
                value: undefined,
            })
        }
    }

    render() {
        const { className, hasWritePermission } = this.props
        const value = this.getValue()

        return (
            <div className={cx(styles.Switcher, className)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    onMessage={this.onMessage}
                    onActiveChange={this.onActiveChange}
                />
                <Toggle
                    disabled={!hasWritePermission}
                    className={styles.Toggle}
                    value={value}
                    onChange={this.onChange}
                />
            </div>
        )
    }
}
