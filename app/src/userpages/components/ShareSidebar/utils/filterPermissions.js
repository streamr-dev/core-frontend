import * as State from '../state'

export default function filterPermissions(permissions) {
    // convert permission.anonymous to permission.user = 'anonymous', if needed
    return permissions
        .map((p) => State.fromAnonymousPermission(p))
}
