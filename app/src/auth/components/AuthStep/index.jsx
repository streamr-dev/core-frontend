// @flow

import * as React from 'react'
import * as yup from 'yup'
import debounce from 'lodash/debounce'
import cx from 'classnames'

import type {
    FieldErrorSetter,
    FlagSetter,
    ErrorHandler,
    FormFields,
} from '$shared/flowtype/auth-types'
import styles from './authStep.pcss'

type Props = {
    className?: string,
    children: React.Node,
    validationSchema?: ?yup.Schema,
    onValidationError?: FieldErrorSetter,
    step: number,
    totalSteps: number,
    setIsProcessing?: FlagSetter,
    isProcessing?: boolean,
    onSubmit: () => Promise<any>,
    onSuccess?: () => void,
    onFailure?: ErrorHandler,
    next?: () => void,
    form?: FormFields,
    autoSubmitOnChange?: Array<string>,
}

class AuthStep extends React.Component<Props> {
    static defaultProps = {
        step: 0,
        totalSteps: 0,
        onSubmit: (): Promise<any> => Promise.resolve(),
    }

    static styles = styles

    componentDidMount() {
        const { form } = this

        if (form) {
            form.addEventListener('change', this.onFieldChange)
        }
    }

    componentDidUpdate({ isProcessing: prevIsProcessing }: Props) {
        const { isProcessing } = this.props

        if (isProcessing && (isProcessing !== prevIsProcessing)) {
            this.submit()
        }
    }

    componentWillUnmount() {
        const { form } = this

        if (form) {
            form.removeEventListener('change', this.onFieldChange)
        }

        this.debouncedScheduleSubmit.cancel()
    }

    onFieldChange = (event: any) => {
        const e: SyntheticInputEvent<EventTarget> = event
        const { autoSubmitOnChange } = this.props

        if ((autoSubmitOnChange || []).includes(e.target.name)) {
            this.debouncedScheduleSubmit()
        }
    }

    onSubmit = (e: SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        this.debouncedScheduleSubmit.cancel()
        this.scheduleSubmit()
    }

    setForm = (ref: ?HTMLFormElement) => {
        this.form = ref
    }

    setProcessing = (value: boolean, callback?: () => void) => {
        const { setIsProcessing } = this.props

        if (setIsProcessing) {
            setIsProcessing(value, callback)
        } else if (callback) {
            callback()
        }
    }

    form: ?HTMLFormElement = null

    validate = (): Promise<any> => {
        const { form, validationSchema } = this.props
        return (validationSchema || yup.object()).validate(form || {})
    }

    scheduleSubmit = () => {
        this.setProcessing(true)
    }

    debouncedScheduleSubmit = debounce(this.scheduleSubmit, 500)

    submit(): Promise<any> {
        const {
            onValidationError,
            step,
            totalSteps,
            onSubmit,
            onSuccess,
            onFailure,
            next,
        } = this.props

        return this.validate()
            .then(() => (
                onSubmit()
                    .then(() => new Promise((resolve) => {
                        this.setProcessing(false, () => {
                            if (onSuccess) {
                                onSuccess()
                            }
                            if ((step < totalSteps - 1) && next) {
                                next()
                            }
                            resolve()
                        })
                    }), (error) => {
                        this.setProcessing(false)
                        if (onFailure) {
                            onFailure(error)
                        }
                    })
            ), (error: yup.ValidationError) => {
                this.setProcessing(false)
                if (!onValidationError) {
                    throw error
                }
                onValidationError(error.path, error.message)
            })
    }

    render() {
        const { children, className } = this.props

        return (
            <form
                onSubmit={this.onSubmit}
                ref={this.setForm}
                className={cx(styles.root, className)}
            >
                {children}
            </form>
        )
    }
}

export default AuthStep
