import { useContext, useMemo, useCallback } from 'react'
import { RecursiveKeyOf } from '$utils/recursiveKeyOf'
import { Project } from '$mp/types/project-types'
import { SeverityLevel, ValidationContext } from './ValidationContextProvider'

const useValidation = (fieldName: RecursiveKeyOf<Project>): {
    isValid: boolean,
    level: SeverityLevel,
    message: string,
    setStatus: (level: SeverityLevel, message: string) => void,
    clearStatus: () => void
} => {
    const { status, setStatus: setStatusState, clearStatus: clearStatusState } = useContext(ValidationContext)
    const setStatus = useCallback(
        (level: SeverityLevel, message: string) => {
            setStatusState(fieldName, level, message)
        },
        [setStatusState, fieldName],
    )
    const clearStatus = useCallback(() => {
        clearStatusState(fieldName)
    }, [clearStatusState, fieldName])
    const result = status[fieldName]
    const isValid = useMemo(() => !result, [result])
    const level = useMemo(() => result && result.level, [result])
    const message = useMemo(() => result && result.message, [result])
    return useMemo(
        () => ({
            isValid,
            level,
            message,
            setStatus,
            clearStatus,
        }),
        [isValid, level, message, setStatus, clearStatus],
    )
}
export default useValidation
