import React, {useMemo, useCallback, useState, FunctionComponent, ReactNode, useContext} from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
import { validate as validateProduct } from '$mp/utils/product'
import { RecursiveKeyOf } from '$utils/recursiveKeyOf'
import { Project } from '$mp/types/project-types'

export enum SeverityLevel {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error'
}

export type ValidationContextProps = {
    setStatus: (name: RecursiveKeyOf<Project>, severity: SeverityLevel, message: string) => void,
    clearStatus: (name: RecursiveKeyOf<Project>) => void,
    status: Partial<Record<RecursiveKeyOf<Project>, {level: SeverityLevel, message: string}>>,
    isValid: (fieldName: RecursiveKeyOf<Project>) => boolean,
    validate: (project: Project) => Partial<Record<RecursiveKeyOf<Project>, {level: SeverityLevel, message: string}>>,
    touched: Partial<Record<RecursiveKeyOf<Project>, boolean>>,
    setTouched: (fieldName: RecursiveKeyOf<Project>, isTouched?: boolean) => void,
    isTouched: (fieldName: RecursiveKeyOf<Project>) => boolean,
    isAnyTouched: () => boolean,
    resetTouched: () => void,
}
export const ValidationContext = React.createContext<ValidationContextProps>({} as ValidationContextProps)

const validationErrors: Partial<Record<RecursiveKeyOf<Project>, string>> = {
    name: 'Product name cannot be empty',
    description: 'Product description cannot be empty',
    creator: 'Missing or invalid creator\'s name',
    imageUrl: 'Product must have a cover image',
    streams: 'No streams selected',
    termsOfUse: 'Invalid URL for detailed terms',
    adminFee: 'Admin fee cannot be empty',
    // beneficiaryAddress: 'A valid ethereum address is needed',
    // pricePerSecond: 'Price should be greater or equal to 0',
    // pricingTokenAddress: 'A valid contract address is needed for payment token',
    'contact.url': 'Invalid URL',
    'contact.twitter': 'Invalid URL',
    'contact.linkedIn': 'Invalid URL',
    'contact.reddit': 'Invalid URL',
    'contact.telegram': 'Invalid URL',
    'contact.email': 'Email address is required',
    salePoints: 'Missing or invalid payment information',
    // keep in mind that we need to provide error messages for each possible chain - otherwise the error messages might not show up
    'salePoints.gnosis': 'Invalid payment information for the Gnosis chain',
    'salePoints.polygon': 'Invalid payment information for the Polygon chain',
    'salePoints.ethereum': 'Invalid payment information for the Ethereum chain',
    'salePoints.dev0': 'Invalid payment information for the dev0 chain',
    'salePoints.dev1': 'Invalid payment information for the dev1 chain'
}

function useValidationContextImplementation(): ValidationContextProps {
    const [status, setStatusState] = useState<Partial<Record<RecursiveKeyOf<Project>, {level: SeverityLevel, message: string}>>>({})
    const [touched, setTouchedState] = useState<Partial<Record<RecursiveKeyOf<Project>, boolean>>>({})
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
        (product: Project): Partial<Record<RecursiveKeyOf<Project>, {level: SeverityLevel, message: string}>> => {
            if (!isMounted() || !product) {
                return
            }

            const invalidFields = validateProduct(product)
            const result: Partial<Record<RecursiveKeyOf<Project>, {level: SeverityLevel, message: string}>> = {
                ...status
            }
            Object.keys(validationErrors).forEach((field: RecursiveKeyOf<Project>) => {
                if (invalidFields[field]) {
                    setStatus(field, SeverityLevel.ERROR, validationErrors[field])
                    result[field] = {level: SeverityLevel.ERROR, message: validationErrors[field]}
                } else {
                    clearStatus(field)
                }
            })
            return result

        },
        [setStatus, clearStatus, isMounted, isTouched, status],
    )
    return useMemo<ValidationContextProps>(
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

export const ValidationContextProvider: FunctionComponent<{children?: ReactNode | ReactNode[] }> = ({ children }) =>{
    return <ValidationContext.Provider value={useValidationContextImplementation()}>{children || null}</ValidationContext.Provider>
}

export const useValidationContext = (): ValidationContextProps => {
    return useContext(ValidationContext)
}
