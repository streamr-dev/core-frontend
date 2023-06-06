import {useMemo} from "react"

/**
 *  here we define the flag names
 */
export enum FeatureFlag {
    phaseTwo = 'phaseTwo'
}

/**
 * here we define the flag values
 */
const flags = new Map<FeatureFlag, FlagValue>([
    [FeatureFlag.phaseTwo, { development: true, staging: true, production: false }],
])

type FlagValue = {
    development: boolean
    staging: boolean
    production: boolean
}

export const useHasFeatureFlag = (flagName: FeatureFlag): boolean => {
    return useMemo<boolean>(() => {
        if (!flags.has(flagName)) {
            throw new Error('Feature flag values not defined')
        }

        let environmentName: keyof FlagValue

        switch (window.location.host) {
            case 'streamr.network':
                environmentName = 'production'
                break
            case 'staging.streamr.network':
                environmentName = 'staging'
                break
            default:
                environmentName = 'development'
                break
        }

        return (flags.get(flagName) as FlagValue)[environmentName]
    }, [flagName])
}
