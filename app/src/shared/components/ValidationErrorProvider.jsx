import React, { createContext, useState, useContext } from 'react'

const ValidationErrorContext = createContext({})

const ValidationErrorSetterContext = createContext(() => {})

export function useValidationError() {
    return useContext(ValidationErrorContext)
}

export function useValidationErrorSetter() {
    return useContext(ValidationErrorSetterContext)
}

export default function ValidationErrorProvider({ children }) {
    const [validationError, setValidationError] = useState({})

    return (
        <ValidationErrorSetterContext.Provider value={setValidationError}>
            <ValidationErrorContext.Provider value={validationError}>
                {children}
            </ValidationErrorContext.Provider>
        </ValidationErrorSetterContext.Provider>
    )
}
