// @flow

import * as React from 'react'

import type {
    FormFields,
    Errors,
} from './types'
import getDisplayName from '$app/src/utils/getDisplayName'

type State = {
    form: FormFields,
    errors: Errors,
    isProcessing: boolean,
    step: number,
}

const withAuthFlow = (WrappedComponent: React.ComponentType<any>, initialStep: number, initialFormFields: FormFields) => {
    class WithAuthFlow extends React.Component<{}, State> {
        static displayName = `WithAuthFlow(${getDisplayName(WrappedComponent)})`

        constructor(props: {}) {
            super(props)

            this.state = {
                step: initialStep,
                isProcessing: false,
                form: initialFormFields,
                errors: {},
            }

            this.setFieldError = this.setFieldError.bind(this)
            this.setFormField = this.setFormField.bind(this)
            this.setIsProcessing = this.setIsProcessing.bind(this)
            this.setStep = this.setStep.bind(this)
            this.prev = this.prev.bind(this)
            this.next = this.next.bind(this)
        }

        setFieldError: Function
        setFieldError(field: string, message: string, callback?: () => void): void {
            const errors = {
                ...this.state.errors,
                [field]: message,
            }
            if (!message) {
                delete errors[field]
            }
            this.setState({
                errors,
            }, callback)
        }

        setFormField: Function
        setFormField(field: string, value: any, callback?: () => void): void {
            this.setFieldError(field, '', () => {
                this.setState({
                    form: {
                        ...this.state.form,
                        [field]: value,
                    },
                }, callback)
            })
        }

        setIsProcessing: Function
        setIsProcessing(isProcessing: boolean, callback?: () => void): void {
            this.setState({
                isProcessing,
            }, callback)
        }

        setStep: Function
        setStep(step: number, callback?: () => void): void {
            this.setState({
                step,
            }, callback)
        }

        next: Function
        next(callback?: () => void): void {
            this.setStep(this.state.step + 1, callback)
        }

        prev: Function
        prev(callback?: () => void): void {
            this.setStep(Math.max(0, this.state.step - 1), callback)
        }

        render() {
            const { step, isProcessing, errors, form } = this.state

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        next={this.next}
                        prev={this.prev}
                        setFormField={this.setFormField}
                        setFieldError={this.setFieldError}
                        setIsProcessing={this.setIsProcessing}
                        step={step}
                        isProcessing={isProcessing}
                        errors={errors}
                        form={form}
                        redirect={() => {}}
                    />
                </React.Fragment>
            )
        }
    }

    return WithAuthFlow
}

export default withAuthFlow
