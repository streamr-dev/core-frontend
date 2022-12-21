import React, { useMemo, useCallback, useState, FunctionComponent, ReactNode } from 'react'
import get from 'lodash/get'
import set from 'lodash/fp/set'
import isPlainObject from 'lodash/isPlainObject'
import useIsMounted from '$shared/hooks/useIsMounted'
import { validate as validateProduct } from '$mp/utils/product'
import { Project } from '$mp/types/project-types'
import { isPublished, getPendingChanges, PENDING_CHANGE_FIELDS } from '../EditProductPage/state'
import useController from '../ProductController/useController'
export const INFO = 'info'
export const WARNING = 'warning'
export const ERROR = 'error'

export type Level = 'info' | 'warning' | 'error'

export type ValidationContextProps = {
    setStatus: (param1: string, param2: Level, param3: string) => void,
    clearStatus: (param: string) => void,
    status: object,
    isValid: (param: string) => boolean,
    validate: (param: object) => void,
    touched: object,
    setTouched: (param1: string, param2?: boolean) => void,
    isTouched: (param: string) => boolean,
    isAnyTouched: () => boolean,
    resetTouched: () => void,
    pendingChanges: object,
    isPendingChange: (param: string) => boolean,
    isAnyChangePending: () => boolean,
}
const ValidationContext = React.createContext<ValidationContextProps>({} as ValidationContextProps)

const isEqual = (a: object, b: object) => JSON.stringify(a) === JSON.stringify(b)

const validationErrors: Record<string, string> = {
    name: 'Product name cannot be empty',
    description: 'Product description cannot be empty',
    chain: 'No chain selected',
    category: 'Product category cannot be empty',
    imageUrl: 'Product must have a cover image',
    streams: 'No streams selected',
    termsOfUse: 'Invalid URL for detailed terms',
    adminFee: 'Admin fee cannot be empty',
    beneficiaryAddress: 'A valid ethereum address is needed',
    pricePerSecond: 'Price should be greater or equal to 0',
    pricingTokenAddress: 'A valid contract address is needed for payment token',
    'contact.url': 'Invalid URL',
    'contact.social1': 'Invalid URL',
    'contact.social2': 'Invalid URL',
    'contact.social3': 'Invalid URL',
    'contact.social4': 'Invalid URL',
    'contact.email': 'Email address is required',
}

// TODO add typing
function useValidationContext(): ValidationContextProps {
    const [status, setStatusState] = useState<any>({})
    const [pendingChanges, setPendingChanges] = useState({})
    const [touched, setTouchedState] = useState<Record<string, boolean>>({})
    const { product: originalProduct } = useController()
    const setTouched = useCallback(
        (name: string, value = true) => {
            setTouchedState((existing) => ({ ...existing, [name]: !!value }))
        },
        [setTouchedState],
    )
    const isTouched = useCallback((name: string) => !!touched[name], [touched])
    const isAnyTouched = useCallback(() => Object.values(touched).some(Boolean), [touched])
    const resetTouched = useCallback(() => setTouchedState({}), [])
    const isMounted = useIsMounted()
    const setPendingChange = useCallback(
        (name: string, isPending = true) => {
            if (!isMounted()) {
                return
            }

            if (!name) {
                throw new Error('pending change needs a name')
            }

            setPendingChanges((state) => set(name, isPending, state))
        },
        [setPendingChanges, isMounted],
    )
    const isPendingChange = useCallback((name: string) => !!get(pendingChanges, name), [pendingChanges])
    const isAnyChangePending = useCallback(
        () =>
            // flatten nested values
            Object.values(pendingChanges)
                .reduce<any[]>(
                    (result: any[], value) => [
                        ...result, // $FlowFixMe value is in fact an object
                        ...(isPlainObject(value) ? Object.values(value) : [value]),
                    ],
                    [],
                )
                .some(Boolean),
        [pendingChanges],
    )
    const setStatus = useCallback(
        (name: string, level: string, message: string) => {
            if (!isMounted()) {
                return
            }

            if (!name) {
                throw new Error('validation needs a name')
            }

            setStatusState((state: any) => ({
                ...state,
                [name]: {
                    level,
                    message,
                },
            }))
        },
        [setStatusState, isMounted],
    )
    const clearStatus = useCallback(
        (name: string) => {
            if (!isMounted()) {
                return
            }

            if (!name) {
                throw new Error('validation needs a name')
            }

            setStatusState(({ [name]: _, ...newState }) => newState)
        },
        [setStatusState, isMounted],
    )
    const isValid = useCallback((name: string) => !status[name], [status])
    const validate = useCallback(
        (product: Project) => {
            if (!isMounted() || !product) {
                return
            }

            const invalidFields = validateProduct(product)
            Object.keys(validationErrors).forEach((field) => {
                if (invalidFields[field]) {
                    setStatus(field, ERROR, validationErrors[field])
                } else {
                    clearStatus(field)
                }
            })
            // Set pending fields, a change is marked pending if there was a saved pending change or
            // we made a change that is different from the loaded product
            const changes = getPendingChanges(product)
            const isPublic = isPublished(product)
            PENDING_CHANGE_FIELDS.forEach((field) => {
                setPendingChange(
                    field,
                    get(changes, field) != null ||
                        (isPublic && isTouched(field) && !isEqual(get(product, field), get(originalProduct, field))),
                )
            })
        },
        [setStatus, clearStatus, isMounted, setPendingChange, isTouched, originalProduct],
    )
    return useMemo(
        () => ({
            setStatus,
            clearStatus,
            isValid,
            touched,
            setTouched,
            isTouched,
            isAnyTouched,
            resetTouched,
            pendingChanges,
            isPendingChange,
            isAnyChangePending,
            status,
            validate,
        }),
        [
            status,
            setStatus,
            isValid,
            touched,
            setTouched,
            isTouched,
            isAnyTouched,
            resetTouched,
            pendingChanges,
            isPendingChange,
            isAnyChangePending,
            clearStatus,
            validate,
        ],
    )
}

const ValidationContextProvider: FunctionComponent<{children?: ReactNode | ReactNode[] }> = ({ children }) =>{
    return <ValidationContext.Provider value={useValidationContext()}>{children || null}</ValidationContext.Provider>
}

export { ValidationContextProvider as Provider, ValidationContext as Context }
