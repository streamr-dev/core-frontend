// @flow

/* eslint-disable react/no-did-update-set-state, jsx-a11y/label-has-associated-control */

import * as React from 'react'
import cx from 'classnames'
import zxcvbn from 'zxcvbn'
import { Translate } from 'react-redux-i18n'

import getDisplayName from '$app/src/utils/getDisplayName'
import StatusBox from './StatusBox'
import InputError from './InputError'
import styles from './formControl.pcss'

type Props = {
    error?: string,
    label: string,
    measureStrength?: boolean | number,
    processing?: boolean,
    type?: string,
    value?: string,
}

type State = {
    focused: boolean,
    autoCompleted: boolean,
    lastKnownError: string,
}

const formControl = (WrappedComponent: React.ComponentType<any>) => (
    class FormControl extends React.Component<Props, State> {
        static displayName = `FormControl(${getDisplayName(WrappedComponent)})`

        state = {
            focused: false,
            autoCompleted: false,
            lastKnownError: this.props.error || '',
        }

        componentDidUpdate(prevProps: Props) {
            const { error } = this.props

            if (error && prevProps.error !== error) {
                this.setState({
                    lastKnownError: error,
                })
            }
        }

        onFocusChange = ({ type }: SyntheticEvent<EventTarget>) => {
            this.setState({
                focused: type === 'focus',
            })
        }

        setAutoCompleted = (autoCompleted: boolean) => {
            this.setState({
                autoCompleted,
            })
        }

        strengthLevel() {
            const { value, type, measureStrength } = this.props

            if (type !== 'password' || !(measureStrength || measureStrength === 0) || !value) {
                return -1
            }

            if (typeof measureStrength === 'number') {
                return measureStrength
            }

            return [0, 1, 1, 2, 2][zxcvbn(value).score]
        }

        render() {
            const {
                processing,
                error,
                value,
                label,
                measureStrength,
                ...props
            } = this.props
            const { lastKnownError, focused, autoCompleted } = this.state
            const strength = this.strengthLevel()

            return (
                <div
                    className={cx(styles.root, {
                        [styles.withError]: !!error && !processing,
                        [styles.focused]: !!focused,
                        [styles.processing]: !!processing,
                        [styles.filled]: !!(value || autoCompleted),
                    })}
                >
                    <label>
                        {[
                            <span key="default">
                                {label}
                            </span>,
                            <span key="weak" className={styles.weak}>
                                <Translate value="auth.password.strength.weak" />
                            </span>,
                            <span key="moderate" className={styles.moderate}>
                                <Translate value="auth.password.strength.moderate" />
                            </span>,
                            <span key="strong" className={styles.strong}>
                                <Translate value="auth.password.strength.strong" />
                            </span>,
                        ][strength + 1]}
                    </label>
                    <StatusBox
                        processing={!!processing}
                        error={!!error || strength === 0}
                        caution={strength === 1}
                        success={strength === 2}
                        active={!!focused}
                    >
                        <WrappedComponent
                            {...props}
                            value={value}
                            onBlur={this.onFocusChange}
                            onFocus={this.onFocusChange}
                            onAutoComplete={this.setAutoCompleted}
                        />
                    </StatusBox>
                    <InputError
                        eligible={!processing && !!error}
                        message={lastKnownError}
                    />
                </div>
            )
        }
    }
)

export default formControl
