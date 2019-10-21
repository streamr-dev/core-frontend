// @flow

import { useState, useEffect } from 'react'

export type LastErrorProps = {
    isProcessing?: boolean,
    error?: any,
}

export function useLastError({ isProcessing, error }: LastErrorProps) {
    const [lastKnownError, setLastKnownError] = useState(error)

    useEffect(() => {
        setLastKnownError((prevError) => {
            if (error && prevError !== error) {
                return error
            }

            return prevError
        })
    }, [error])

    return {
        hasError: !isProcessing && !!error,
        error: lastKnownError,
    }
}

export default useLastError
