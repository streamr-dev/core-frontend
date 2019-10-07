/* eslint-disable react/no-unused-state */

import React from 'react'
import cx from 'classnames'
import throttle from 'lodash/throttle'

import UiSizeConstraint from '../UiSizeConstraint'
import ModuleSubscription from '../ModuleSubscription'

import TextControl from '$shared/components/TextControl'
import styles from './TextField.pcss'

export default class TextFieldModule extends React.Component {
    state = {}

    subscription = React.createRef()

    onChange = (textFieldValue) => {
        if (this.props.isActive) {
            this.setState({
                value: textFieldValue,
            })
        } else {
            this.props.api.updateModule(this.props.moduleHash, {
                textFieldValue,
            })
        }
    }

    onMessage = throttle(({ textFieldValue: value }) => {
        this.setState({
            value,
        })
    }, 250)

    onClick = async () => {
        this.subscription.current.send({
            type: 'uiEvent',
            value: this.getValue(),
        })
    }

    getValue = () => {
        let { value } = this.state
        if (value == null) {
            // use module value unless state set
            const { module } = this.props
            value = module.textFieldValue
        }
        return value
    }

    onActiveChange = (isActive) => {
        if (!isActive) {
            this.setState({
                value: undefined,
            })
        }
    }

    render() {
        const { isActive, hasWritePermission } = this.props
        const value = this.getValue()
        return (
            <UiSizeConstraint minWidth={150} minHeight={75}>
                <div className={cx(this.props.className, styles.TextField)}>
                    <ModuleSubscription
                        {...this.props}
                        ref={this.subscription}
                        onMessage={this.onMessage}
                        onActiveChange={this.onActiveChange}
                    />
                    <TextControl
                        commitEmpty
                        flushHistoryOnBlur
                        onCommit={this.onChange}
                        placeholder="Enter your text here"
                        tag="textarea"
                        value={value}
                    />
                    <button
                        type="button"
                        className={styles.button}
                        onClick={this.onClick}
                        disabled={!hasWritePermission || !isActive}
                    >
                        Send
                    </button>
                </div>
            </UiSizeConstraint>
        )
    }
}
