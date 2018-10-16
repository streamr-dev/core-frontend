// @flow

import * as React from 'react'
import { Schema } from 'yup'

import AuthPanelNav from '../AuthPanelNav'
import Switch from '../Switch'
import styles from './authPanel.pcss'
import type {
    FormFields,
    FlagSetter,
    FieldErrorSetter,
} from '../types'
import { noop } from '../utils'

export {
    styles,
}

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

type TitleProps = {
    children: React.Node,
}

class AuthPanel extends React.Component<Props> {
    static Title = ({ children }: TitleProps) => (
        <span>{children}</span>
    )

    render = () => {
        const { children, onPrev, currentStep, validationSchemas, onValidationError, setIsProcessing, onNext: next, form, isProcessing } = this.props
        const totalSteps = React.Children.count(children)

        return (
            <div className={styles.authPanel}>
                <Switch current={currentStep}>
                    {React.Children.map(children, (child) => (
                        <AuthPanelNav
                            signin={!!child.props.showSignin}
                            signup={!!child.props.showSignup}
                            onUseEth={child.props.showEth ? noop : null}
                            onGoBack={child.props.showBack ? onPrev : null}
                        />
                    ))}
                </Switch>
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <Switch current={currentStep}>
                            {React.Children.map(children, (child) => (
                                <AuthPanel.Title>
                                    {child.props.title || 'Title'}
                                </AuthPanel.Title>
                            ))}
                        </Switch>
                    </div>
                    <div className={styles.body}>
                        <Switch current={currentStep}>
                            {React.Children.map(children, (child, index) => React.cloneElement(child, {
                                validationSchema: validationSchemas[index],
                                step: index,
                                totalSteps,
                                onValidationError,
                                setIsProcessing,
                                isProcessing,
                                next,
                                form,
                                current: index === currentStep,
                            }))}
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default AuthPanel
