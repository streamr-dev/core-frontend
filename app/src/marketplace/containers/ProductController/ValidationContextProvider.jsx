// @flow

import React, { useMemo, useCallback, useState, type Node, type Context } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'

import { isEthereumAddress } from '$mp/utils/validate'
import { isPaidProduct } from '$mp/utils/product'
import { isPriceValid } from '$mp/utils/price'

export const INFO = 'info'
export const WARNING = 'warning'
export const ERROR = 'error'

export type Level = 'info' | 'warning' | 'error'

type ContextProps = {
    setStatus: (string, Level, string) => void,
    clearStatus: (string) => void,
    status: Object,
    validate: (Object) => void,
    touched: Object,
    touch: (string) => void,
    isTouched: (string) => boolean,
}

const ValidationContext: Context<ContextProps> = React.createContext({})

function useValidationContext(): ContextProps {
    const [status, setStatusState] = useState({})
    const [touched, setTouched] = useState({})

    const touch = useCallback((name: string) => {
        setTouched((existing) => ({
            ...existing,
            [name]: true,
        }))
    }, [setTouched])
    const isTouched = useCallback((name: string) => !!touched[name], [touched])

    const isMounted = useIsMounted()

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

        setStatusState((state) => ({
            ...state,
            [name]: undefined,
        }))
    }, [setStatusState, isMounted])

    const validate = useCallback((product) => {
        if (!isMounted() || !product) { return }

        ['name', 'description', 'imageUrl', 'category'].forEach((field) => {
            if (String(product[field]).length <= 0) {
                setStatus(field, ERROR, `Product ${field} cannot be empty`)
            } else {
                clearStatus(field)
            }
        })

        if (!product.streams || product.streams.length <= 0) {
            setStatus('streams', ERROR, 'No streams selected')
        } else {
            clearStatus('streams')
        }

        const isPaid = isPaidProduct(product)

        // applies only to community product
        if (product.type === 'COMMUNITY') {
            if (!product.adminFee || (product.adminFee < 10 && product.adminFee > 90)) {
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
                setStatus('price', ERROR, 'Price should be greater or equal to 0')
            } else {
                clearStatus('price')
            }
        } else {
            clearStatus('price')
        }
    }, [setStatus, clearStatus, isMounted])

    return useMemo(() => ({
        setStatus,
        clearStatus,
        touched,
        touch,
        isTouched,
        status,
        validate,
    }), [status, setStatus, touched, touch, isTouched, clearStatus, validate])
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
