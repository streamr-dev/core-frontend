// @flow

import React, { type Node, useContext } from 'react'
import { Schema } from 'yup'

import AuthFormContext from '$auth/contexts/AuthForm'
import AuthPanelNav from '../AuthPanelNav'
import type { FieldErrorSetter } from '$shared/flowtype/auth-types'
import styles from './authPanel.pcss'

type Props = {
    children: Node,
    onPrev?: ?() => void,
    onValidationError: FieldErrorSetter,
    validationSchemas: Array<Schema>,
}

const AuthPanel = ({ children, onPrev, validationSchemas, onValidationError }: Props) => {
    const {
        form,
        isProcessing,
        next,
        prev,
        setIsProcessing,
        step,
    } = useContext(AuthFormContext)
    const totalSteps = React.Children.count(children)
    const child = React.Children.toArray(children)[step]

    return (
        <div className={styles.authPanel}>
            <AuthPanelNav
                signin={!!child.props.showSignin}
                signup={!!child.props.showSignup}
                onUseEth={child.props.onEthereumClick}
                onGoBack={child.props.showBack ? (onPrev || prev) : null}
            />
            <div className={styles.panel}>
                <div className={styles.header}>
                    <span data-title>
                        {child.props.title}
                    </span>
                </div>
                <div className={styles.body}>
                    {React.cloneElement(child, {
                        current: true,
                        form,
                        isProcessing,
                        next,
                        onValidationError,
                        setIsProcessing,
                        step,
                        totalSteps,
                        validationSchema: validationSchemas[step],
                    })}
                </div>
            </div>
        </div>
    )
}

export default AuthPanel
