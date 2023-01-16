import React, { useMemo, useCallback, useState, FunctionComponent, ReactNode } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
import { validate as validateProduct } from '$mp/utils/product'
import { RecursiveKeyOf } from '$utils/recursiveKeyOf'
import { Project } from '$mp/types/project-types'
import { isPublished, getPendingChanges } from '../EditProductPage/state'

export enum SeverityLevel {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error'
}

export type ValidationContext2Props = {
    setStatus: (name: RecursiveKeyOf<Project>, severity: SeverityLevel, message: string) => void,
    clearStatus: (name: RecursiveKeyOf<Project>) => void,
    status: object,
    isValid: (fieldName: RecursiveKeyOf<Project>) => boolean,
    validate: (project: Project) => void,
    touched: Partial<Record<RecursiveKeyOf<Project>, string>>,
    setTouched: (fieldName: RecursiveKeyOf<Project>, isTouched?: boolean) => void,
    isTouched: (fieldName: RecursiveKeyOf<Project>) => boolean,
    isAnyTouched: () => boolean,
    resetTouched: () => void,
}
export const ValidationContext2 = React.createContext<ValidationContext2Props>({} as ValidationContext2Props)

const validationErrors: Partial<Record<RecursiveKeyOf<Project>, string>> = {
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

function useValidationContext2(): ValidationContext2Props {
    const [status, setStatusState] = useState<Partial<Record<RecursiveKeyOf<Project>, {level: SeverityLevel, message: string}>>>({})
    const [touched, setTouchedState] = useState<Record<string, boolean>>({})
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
        (name: RecursiveKeyOf<Project>) => {
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
            Object.keys(validationErrors).forEach((field: RecursiveKeyOf<Project>) => {
                if (invalidFields[field]) {
                    setStatus(field, SeverityLevel.ERROR, validationErrors[field])
                } else {
                    clearStatus(field)
                }
            })
            // Set pending fields, a change is marked pending if there was a saved pending change or
            // we made a change that is different from the loaded product
            const changes = getPendingChanges(product)
            const isPublic = isPublished(product)
        },
        [setStatus, clearStatus, isMounted, isTouched],
    )
    return useMemo<ValidationContext2Props>(
        () => ({
            setStatus,
            clearStatus,
            isValid,
            touched,
            setTouched,
            isTouched,
            isAnyTouched,
            resetTouched,
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
            clearStatus,
            validate,
        ],
    )
}

export const ValidationContext2Provider: FunctionComponent<{children?: ReactNode | ReactNode[] }> = ({ children }) =>{
    return <ValidationContext2.Provider value={useValidationContext2()}>{children || null}</ValidationContext2.Provider>
}

