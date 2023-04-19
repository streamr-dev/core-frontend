import {
    hasActiveProjectSubscription,
    isPaidProject,
    isProjectOwnedBy,
} from '$mp/utils/product'
import { useLoadedProject } from '$mp/contexts/LoadedProjectContext'
import { useAuthController } from '$app/src/auth/hooks/useAuthController'

export const useUserHasAccessToProject = (): boolean => {
    const { loadedProject: project, theGraphProject } = useLoadedProject()

    const { currentAuthSession: { address = undefined } = {} } = useAuthController() || {}

    if (!theGraphProject || !project) {
        return false
    }

    if (!isPaidProject(project)) {
        return true
    }

    if (!address) {
        return false
    }

    return (
        isProjectOwnedBy(theGraphProject, address) ||
        hasActiveProjectSubscription(theGraphProject, address)
    )
}
