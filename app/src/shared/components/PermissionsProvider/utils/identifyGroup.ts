import groups, { DEFAULTS_KEYS } from '../groups'
import countOperations from './countOperations'
// TODO add typing
export default function identifyGroup(resourceType: any, combination: any): any {
    return Object.entries(groups[resourceType]).reduce(
        (
            memo,
            [group, groupCombination], // eslint-disable-next-line no-bitwise
        ) => (countOperations(combination & groupCombination) === countOperations(groupCombination) ? group : memo),
        DEFAULTS_KEYS[resourceType],
    )
}
