import { Operation } from '../operations'
import getOperationKeys from './getOperationKeys'
import toOperationName from './toOperationName'

export default function formatAssignments(changeset: Record<string, Operation>): any {
    return Object.entries(changeset).map(([user, combination]) => ({
        user,
        permissions: getOperationKeys(combination).map((c) => toOperationName(c.toString())),
    }))
}
