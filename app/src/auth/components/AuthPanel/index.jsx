// @flow

import * as React from 'react'
import { Schema } from 'yup'
import noop from 'empty/function'

import AuthPanelNav from '../AuthPanelNav'
import type {
    FormFields,
    FlagSetter,
    FieldErrorSetter,
} from '../../flowtype'
import styles from './authPanel.pcss'

type Props = {
    form: FormFields,
    children: React.Node,
    currentStep: number,
    onPrev: () => void,
    onNext: () => void,
    setIsProcessing: FlagSetter,
    isProcessing?: boolean,
    validationSchemas: Array<Schema>,
    onValidationError: FieldErrorSetter,
}

const AuthPanel = ({
    children,
    onPrev,
    currentStep,
    validationSchemas,
    onValidationError,
    setIsProcessing,
    onNext: next,
    form,
    isProcessing,
}: Props) => {
    const totalSteps = React.Children.count(children)
    const child = React.Children.toArray(children)[currentStep]

    return (
        <div className={styles.authPanel}>
            <AuthPanelNav
                signin={!!child.props.showSignin}
                signup={!!child.props.showSignup}
                onUseEth={child.props.showEth ? noop : null}
                onGoBack={child.props.showBack ? onPrev : null}
            />
            <div className={styles.panel}>
                <div className={styles.header}>
                    <span>
                        {child.props.title}
                    </span>
                </div>
                <div className={styles.body}>
                    {React.cloneElement(child, {
                        validationSchema: validationSchemas[currentStep],
                        step: currentStep,
                        totalSteps,
                        onValidationError,
                        setIsProcessing,
                        isProcessing,
                        next,
                        form,
                        current: true,
                    })}
                </div>
            </div>
        </div>
    )
}

export default AuthPanel
