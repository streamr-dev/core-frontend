// @flow

import React, { useMemo, useCallback, useState, type Node, type Context } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'

export const INFO = 'info'
export const WARNING = 'warning'
export const ERROR = 'error'

export type Level = 'info' | 'warning' | 'error'

type ContextProps = {
    setStatus: (string, Level, string) => void,
    clearStatus: (string) => void,
    status: Object,
    validate: (Object) => void,
}

const ValidationContext: Context<ContextProps> = React.createContext({})

function useValidationContext(): ContextProps {
    const [status, setStatusState] = useState({})
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

        ['name', 'description', 'imageUrl'].forEach((field) => {
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
    }, [setStatus, clearStatus, isMounted])

    return useMemo(() => ({
        setStatus,
        clearStatus,
        status,
        validate,
    }), [status, setStatus, clearStatus, validate])
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
