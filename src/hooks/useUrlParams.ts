import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

interface UrlParamConfig<T extends string> {
    param: string
    value: T | undefined
    defaultValue: T
}

export function useUrlParams<T extends string>(params: UrlParamConfig<T>[]) {
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        // Check if current params are different from desired params
        let needsUpdate = false
        const currentParams = new URLSearchParams(searchParams)

        params.forEach(({ param, value, defaultValue }) => {
            const currentValue = currentParams.get(param)
            const targetValue = value !== defaultValue ? value || defaultValue : null

            if (targetValue === null && currentValue !== null) {
                needsUpdate = true
            } else if (targetValue !== null && targetValue !== currentValue) {
                needsUpdate = true
            }
        })

        // Only update if necessary
        if (needsUpdate) {
            setSearchParams((prevParams) => {
                const newParams = new URLSearchParams(prevParams)

                params.forEach(({ param, value, defaultValue }) => {
                    if (value === '' || value === undefined) {
                        newParams.delete(param)
                    } else if (value !== defaultValue) {
                        newParams.set(param, value)
                    } else {
                        newParams.delete(param)
                    }
                })

                return newParams
            })
        }
    }, [params, searchParams, setSearchParams])
}
