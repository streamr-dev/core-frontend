export type FormFields = Record<string, any>
export type Errors = Record<string, string>
export type FieldSetter = (arg0: string, arg1: any, arg2: (() => void) | null | undefined) => void
export type FieldErrorSetter = (arg0: string, arg1: string) => void
export type FlagSetter = (arg0: boolean, arg1: (() => void) | null | undefined) => void
export type ErrorHandler = (arg0: Error) => void
export type AuthFlowProps = {
    errors: Errors
    form: FormFields
    isProcessing: boolean
    next: () => void
    prev: () => void
    setFieldError: FieldErrorSetter
    setFormField: FieldSetter
    setIsProcessing: () => void
    step: number
    redirect: () => void
}
export type ValueFormatter<T> = (arg0: T) => string
