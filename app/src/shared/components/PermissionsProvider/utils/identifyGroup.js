import groups, { DEFAULTS_KEYS } from '../groups'
import count from './count'

export default function identifyGroup(resourceType, combination) {
    return (
        Object.entries(groups[resourceType]).reduce((memo, [group, groupCombination]) => (
            // eslint-disable-next-line no-bitwise
            count(combination & groupCombination) >= count(groupCombination) ? group : memo
        ), DEFAULTS_KEYS[resourceType])
    )
}
