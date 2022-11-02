import groups, { DEFAULTS_KEYS } from '../groups'
import countOperations from './countOperations'
// TODO add typing
export default function identifyGroup(resourceType: any, combination: any): any {
    return Object.entries((groups as any)[resourceType]).reduce(
        (
            memo,
            [group, groupCombination]: [any, any], // eslint-disable-next-line no-bitwise
        ) => (countOperations(combination & groupCombination) === countOperations(groupCombination) ? group : memo),
        (DEFAULTS_KEYS as any)[resourceType],
    )
}
