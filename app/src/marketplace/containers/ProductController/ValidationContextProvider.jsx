import React, { useMemo, useCallback, useState } from 'react'
import get from 'lodash/get'
import set from 'lodash/fp/set'
import isPlainObject from 'lodash/isPlainObject'
import useIsMounted from '$shared/hooks/useIsMounted'

import { validate as validateProduct } from '$mp/utils/product'
import { isPublished, getPendingChanges, PENDING_CHANGE_FIELDS } from '../EditProductPage/state'
import useController from '../ProductController/useController'

export const INFO = 'info'
export const WARNING = 'warning'
export const ERROR = 'error'

// @FIXME: Rewrite in typescript.
//
// export type Level = 'info' | 'warning' | 'error'
//
// type ContextProps = {
//     setStatus: (string, Level, string) => void,
//     clearStatus: (string) => void,
//     status: Object,
//     isValid: (string) => boolean,
//     validate: (Object) => void,
//     touched: Object,
//     setTouched: (string, ?boolean) => void,
//     isTouched: (string) => boolean,
//     isAnyTouched: () => boolean,
//     resetTouched: () => void,
//     pendingChanges: Object,
//     isPendingChange: (string) => boolean,
//     isAnyChangePending: () => boolean,
// }

const ValidationContext = React.createContext({})

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const validationErrors = {
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
    'contact.url': 'Invalid URL',
    'contact.social1': 'Invalid URL',
    'contact.social2': 'Invalid URL',
    'contact.social3': 'Invalid URL',
    'contact.social4': 'Invalid URL',
    'contact.email': 'Email address is required',
}

function useValidationContext() {
    const [status, setStatusState] = useState({})
    const [pendingChanges, setPendingChanges] = useState({})
    const [touched, setTouchedState] = useState({})
    const { product: originalProduct } = useController()

    const setTouched = useCallback((name, value = true) => {
        setTouchedState((existing) => ({
            ...existing,
            [name]: !!value,
        }))
    }, [setTouchedState])
    const isTouched = useCallback((name) => !!touched[name], [touched])

    const isAnyTouched = useCallback(() => Object.values(touched).some(Boolean), [touched])

    const resetTouched = useCallback(() => setTouchedState({}), [])

    const isMounted = useIsMounted()

    const setPendingChange = useCallback((name, isPending = true) => {
        if (!isMounted()) { return }
        if (!name) {
            throw new Error('pending change needs a name')
        }

        setPendingChanges((state) => set(name, isPending, state))
    }, [setPendingChanges, isMounted])

    const isPendingChange = useCallback((name) => !!(get(pendingChanges, name)), [pendingChanges])

    const isAnyChangePending = useCallback(() => (
        // flatten nested values
        Object.values(pendingChanges)
            .reduce((result, value) => ([
                ...result,
                // $FlowFixMe value is in fact an object
                ...(isPlainObject(value) ? Object.values(value) : [value]),
            ]), [])
            .some(Boolean)
    ), [pendingChanges])

    const setStatus = useCallback((name, level, message) => {
        if (!isMounted()) { return }
        if (!name) {
            throw new Error('validation needs a name')
        }

        setStatusState((state) => ({
            ...state,
            [name]: {
                level,
                message,
            },
        }))
    }, [setStatusState, isMounted])

    const clearStatus = useCallback((name) => {
        if (!isMounted()) { return }
        if (!name) {
            throw new Error('validation needs a name')
        }

        setStatusState(({ [name]: _, ...newState }) => newState)
    }, [setStatusState, isMounted])

    const isValid = useCallback((name) => !status[name], [status])

    const validate = useCallback((product) => {
        if (!isMounted() || !product) { return }

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
                get(changes, field) != null || (isPublic && isTouched(field) && !isEqual(get(product, field), get(originalProduct, field))),
            )
        })
    }, [setStatus, clearStatus, isMounted, setPendingChange, isTouched, originalProduct])

    return useMemo(() => ({
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
    }), [
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
    ])
}

function ValidationContextProvider({ children }) {
    return (
        <ValidationContext.Provider value={useValidationContext()}>
            {children || null}
        </ValidationContext.Provider>
    )
}

export {
    ValidationContextProvider as Provider,
    ValidationContext as Context,
}
