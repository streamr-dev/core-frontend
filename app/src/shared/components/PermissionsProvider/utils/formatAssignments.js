import getOperationKeys from './getOperationKeys'
import toOperationName from './toOperationName'

export default function formatAssignments(changeset) {
    return Object.entries(changeset).map(([user, combination]) => ({
        user,
        permissions: getOperationKeys(combination).map(toOperationName),
    }))
}
