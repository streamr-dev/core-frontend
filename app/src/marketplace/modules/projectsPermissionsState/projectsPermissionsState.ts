import {ProjectPermissions} from "$app/src/services/projects"

export type ProjectsPermissionsState = {
    [projectId: string]: {
        [userAddress: string]: ProjectPermissions
    }
}

export const projectsPermissionsReducer = (
    state: ProjectsPermissionsState,
    action: {projectId: string, userAddress: string, permissions: ProjectPermissions}
): ProjectsPermissionsState => {
    const currentProjectPermissions = state[action.projectId] || {}
    return {
        ...state,
        [action.projectId]: {
            ...currentProjectPermissions,
            [action.userAddress]: action.permissions
        }
    }
}
