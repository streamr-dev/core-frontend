// @flow

import React, { useMemo, useCallback, useState, type Node, type Context } from 'react'
import * as yup from 'yup'
import useIsMounted from '$shared/hooks/useIsMounted'
import get from 'lodash/get'
import set from 'lodash/fp/set'

import { isEthereumAddress } from '$mp/utils/validate'
import { isPaidProduct, isDataUnionProduct } from '$mp/utils/product'
import { isPriceValid } from '$mp/utils/price'
import { isPublished, getPendingChanges, PENDING_CHANGE_FIELDS } from '../EditProductPage/state'
import useProduct from '../ProductController/useProduct'

export const INFO = 'info'
export const WARNING = 'warning'
export const ERROR = 'error'

export type Level = 'info' | 'warning' | 'error'

type ContextProps = {
    setStatus: (string, Level, string) => void,
    clearStatus: (string) => void,
    status: Object,
    isValid: (string) => boolean,
    validate: (Object) => void,
    touched: Object,
    touch: (string) => void,
    isTouched: (string) => boolean,
    isAnyTouched: () => boolean,
    resetTouched: () => void,
    pendingChanges: Object,
    isPendingChange: (string) => boolean,
    isAnyChangePending: () => boolean,
}

const ValidationContext: Context<ContextProps> = React.createContext({})

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const urlValidator = yup.string().trim().url()
const emailValidator = yup.string().trim().email()

function useValidationContext(): ContextProps {
    const [status, setStatusState] = useState({})
    const [pendingChanges, setPendingChanges] = useState({})
    const [touched, setTouched] = useState({})
    const originalProduct = useProduct()

    const touch = useCallback((name: string) => {
        setTouched((existing) => ({
            ...existing,
            [name]: true,
        }))
    }, [setTouched])
    const isTouched = useCallback((name: string) => !!touched[name], [touched])

    const isAnyTouched = useCallback(() => Object.values(touched).some(Boolean), [touched])

    const resetTouched = useCallback(() => setTouched({}), [])

    const isMounted = useIsMounted()

    const setPendingChange = useCallback((name: string, isPending: boolean = true): Object => {
        if (!isMounted()) { return }
        if (!name) {
            throw new Error('pending change needs a name')
        }

        setPendingChanges((state) => set(name, isPending, state))
    }, [setPendingChanges, isMounted])
    const isPendingChange = useCallback((name: string) => !!(get(pendingChanges, name)), [pendingChanges])
    const isAnyChangePending = useCallback(() => Object.values(pendingChanges).some(Boolean), [pendingChanges])

    const setStatus = useCallback((name: string, level: Level, message: string): Object => {
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

    const clearStatus = useCallback((name: string): Object => {
        if (!isMounted()) { return }
        if (!name) {
            throw new Error('validation needs a name')
        }

        setStatusState((prevState) => {
            const newState = {
                ...prevState,
            }
            delete newState[name]

            return newState
        })
    }, [setStatusState, isMounted])

    const isValid = useCallback((name: string) => !status[name], [status])

    const validate = useCallback((product) => {
        if (!isMounted() || !product) { return }

        ['name', 'description', 'category'].forEach((field) => {
            if (!product[field]) {
                setStatus(field, ERROR, `Product ${field} cannot be empty`)
            } else {
                clearStatus(field)
            }
        })

        if (!product.imageUrl && !product.newImageToUpload) {
            setStatus('imageUrl', ERROR, 'Product must have a cover image')
        } else {
            clearStatus('imageUrl')
        }

        if (!product.streams || product.streams.length <= 0) {
            setStatus('streams', ERROR, 'No streams selected')
        } else {
            clearStatus('streams')
        }

        if (product.termsOfUse != null && product.termsOfUse.termsUrl) {
            const result = urlValidator.isValidSync(product.termsOfUse.termsUrl)
            if (!result) {
                setStatus('termsOfUse', ERROR, 'Invalid URL for detailed terms')
            } else {
                clearStatus('termsOfUse')
            }
        }

        const isPaid = isPaidProduct(product)

        // applies only to data union
        if (isDataUnionProduct(product)) {
            if (!product.adminFee || !(product.adminFee > 0 && product.adminFee <= 1)) {
                setStatus('adminFee', ERROR, 'Admin fee cannot be empty')
            } else {
                clearStatus('adminFee')
            }
            clearStatus('beneficiaryAddress')
        } else {
            if (isPaid && (!product.beneficiaryAddress || !isEthereumAddress(product.beneficiaryAddress))) {
                setStatus('beneficiaryAddress', ERROR, 'A valid ethereum address is needed')
            } else {
                clearStatus('beneficiaryAddress')
            }
            clearStatus('adminFee')
        }

        if (isPaid) {
            if (!isPriceValid(product.pricePerSecond)) {
                setStatus('pricePerSecond', ERROR, 'Price should be greater or equal to 0')
            } else {
                clearStatus('pricePerSecond')
            }
        } else {
            clearStatus('pricePerSecond')
        }

        if (product.contact) {
            ['url', 'social1', 'social2', 'social3', 'social4'].forEach((field) => {
                if (product.contact[field] && product.contact[field].length > 0) {
                    const result = urlValidator.isValidSync(product.contact[field])
                    if (!result) {
                        setStatus(`contact.${field}`, ERROR, 'Invalid URL')
                    } else {
                        clearStatus(`contact.${field}`)
                    }
                } else {
                    clearStatus(`contact.${field}`)
                }
            })

            if (product.contact.email && product.contact.email.length > 0) {
                const result = emailValidator.isValidSync(product.contact.email)
                if (!result && product.contact.email) {
                    setStatus('contact.email', ERROR, 'Invalid email address')
                } else {
                    clearStatus('contact.email')
                }
            } else {
                clearStatus('contact.email')
            }
        }

        // Set pending fields, a change is marked pending if there was a saved pending change or
        // we made a change that is different from the loaded product
        const changes = getPendingChanges(product)
        const isPublic = isPublished(product)
        PENDING_CHANGE_FIELDS.forEach((field) => {
            setPendingChange(
                field,
                get(changes, field) || (isPublic && isTouched(field) && !isEqual(get(product, field), get(originalProduct, field))),
            )
        })
    }, [setStatus, clearStatus, isMounted, setPendingChange, isTouched, originalProduct])

    return useMemo(() => ({
        setStatus,
        clearStatus,
        isValid,
        touched,
        touch,
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
        touch,
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

type Props = {
    children?: Node,
}

function ValidationContextProvider({ children }: Props) {
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
