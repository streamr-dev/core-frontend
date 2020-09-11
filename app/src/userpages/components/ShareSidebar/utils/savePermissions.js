import {
    getResourcePermissions,
    addResourcePermission,
    removeResourcePermission,
} from '$userpages/modules/permission/services'
import * as State from '../state'
import filterPermissions from './filterPermissions'

/*
 * big horrible async handler for updating permission records
 * each permission that was added needs to send a request that it be created
 * each permission that was removed added needs to send a request that it be removed
 * Issues all requests in parallel, should not abort if one fails.
 * Returns any errors
 */

export default async function savePermissions(currentUsers, props) {
    const { resourceType, resourceId } = props
    const oldPermissions = filterPermissions(await getResourcePermissions({
        resourceType,
        resourceId,
    }))
    const { added, removed } = State.diffUsersPermissions({
        oldPermissions,
        newUsers: currentUsers,
        resourceType,
    })

    const allChangedUserIds = [
        ...new Set([
            ...added.map(({ user }) => user),
            ...removed.map(({ user }) => user),
        ]),
    ]
    const errors = {}
    await Promise.all(allChangedUserIds.map(async (userId) => {
        const userAddedItems = added.filter((p) => p.user === userId)
        const userRemovedItems = removed.filter((p) => p.id != null && p.user === userId)
        await Promise.all([
            ...userAddedItems.map(async (data) => addResourcePermission({
                resourceType,
                resourceId,
                data: State.toAnonymousPermission(data),
            })),
            ...userRemovedItems.map(async ({ id }) => removeResourcePermission({
                resourceType,
                resourceId,
                id,
            })),
        ].map((task) => task.catch((error) => {
            console.error(error) // eslint-disable-line no-console
            // store failure but do not abort
            // if user has multiple errors will only store one,
            // this is fine, we don't need to show all of them
            errors[userId] = error
        })))
    }))

    return {
        errors,
    }
}
