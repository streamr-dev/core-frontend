export enum FeatureFlag {
    PhaseTwo = 'PhaseTwo',
}

const flags = new Map<FeatureFlag, FlagValue>([
    [FeatureFlag.PhaseTwo, { development: true, staging: true, production: false }],
])

type FlagValue = {
    development: boolean
    staging: boolean
    production: boolean
}

export const isFeatureEnabled = (flagName: FeatureFlag): boolean => {
    const flag = flags.get(flagName)

    if (!flag) {
        throw new Error('Feature flag values not defined')
    }

    switch (window.location.host) {
        case 'streamr.network':
            return flag.production
        case 'staging.streamr.network':
            return flag.staging
        default:
            return flag.development
    }
}
