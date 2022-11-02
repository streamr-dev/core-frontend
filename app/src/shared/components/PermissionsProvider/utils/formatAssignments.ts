import getOperationKeys from './getOperationKeys'
import toOperationName from './toOperationName'
// TODO add typing
export default function formatAssignments(changeset: any): any {
    return Object.entries(changeset).map(([user, combination]) => ({
        user,
        permissions: getOperationKeys(combination).map(toOperationName),
    }))
}
