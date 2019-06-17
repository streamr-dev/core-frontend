// @flow

/* eslint-disable react/no-did-update-set-state, jsx-a11y/label-has-associated-control */

import * as React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import PasswordStrength from '../PasswordStrength'
import Underline from './Underline'
import InputError from './InputError'
import styles from './formControl.pcss'

export type InputProps = {
    onFocusChange: (SyntheticEvent<EventTarget>) => void,
    setAutoCompleted: (boolean) => void,
    value: any,
}

export type FormControlProps = {
    error?: string,
    label: string,
    measureStrength?: boolean,
    processing?: boolean,
    type?: string,
    value?: any,
    preserveLabelSpace?: boolean,
    preserveErrorSpace?: boolean,
    preserveLabelPosition?: boolean,
    noUnderline?: boolean,
    passwordStrengthUpdate?: (PasswordStrength: number) => void,
}

type Props = FormControlProps & {
    children?: (InputProps) => React.Node,
}

type State = {
    focused: boolean,
    autoCompleted: boolean,
    lastKnownError: string,
}

class FormControl extends React.PureComponent<Props, State> {
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

    children() {
        const {
            processing,
            error,
            value,
            label,
            measureStrength,
            preserveLabelSpace,
            preserveErrorSpace,
            preserveLabelPosition,
            noUnderline,
            children,
            passwordStrengthUpdate,
            ...props
        } = this.props

        if (!children) {
            return null
        }

        return children({
            ...props,
            setAutoCompleted: this.setAutoCompleted,
            onFocusChange: this.onFocusChange,
            value,
        })
    }

    render() {
        const {
            processing,
            error,
            value,
            label,
            preserveLabelSpace,
            preserveErrorSpace,
            preserveLabelPosition,
            noUnderline,
            measureStrength,
            type,
            passwordStrengthUpdate,
        } = this.props
        const { lastKnownError, focused, autoCompleted } = this.state

        return (
            <PasswordStrength
                value={value}
                passwordStrengthUpdate={passwordStrengthUpdate}
                enabled={type === 'password' && measureStrength}
            >
                {(strength) => (
                    <div
                        className={cx(styles.root, {
                            [styles.withError]: !!error && !processing,
                            [styles.focused]: !!focused,
                            [styles.processing]: !!processing,
                            [styles.filled]: !!(value || autoCompleted || preserveLabelPosition),
                            [styles.withLabelSpace]: preserveLabelSpace,
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
                        {noUnderline ? this.children() : (
                            <Underline
                                focused={focused}
                                caution={strength === 1}
                                error={!!error || strength === 0}
                                processing={processing}
                                success={strength === 2}
                            >
                                {this.children()}
                            </Underline>
                        )}
                        <InputError
                            preserved={preserveErrorSpace}
                            eligible={!processing && !!error}
                            message={lastKnownError}
                        />
                    </div>
                )}
            </PasswordStrength>
        )
    }
}

export default FormControl
