import { hasActiveProjectSubscription, isPaidProject, isProjectOwnedBy } from '$mp/utils/product'
import { useIsAuthenticated } from '$auth/hooks/useIsAuthenticated'
import { useLoadedProject } from '$mp/contexts/LoadedProjectContext'
import { useAuthController } from '$app/src/auth/hooks/useAuthController'

export const useUserHasAccessToProject = (): boolean => {
    const { loadedProject: project, theGraphProject } = useLoadedProject()
    const isLoggedIn = useIsAuthenticated()
    const isPaid = isPaidProject(project)
    const { currentAuthSession } = useAuthController()

    if (!isPaid) {
        return true
    }

    if (!isLoggedIn) {
        return false
    }

    if (currentAuthSession != null && isProjectOwnedBy(theGraphProject, currentAuthSession.address)) {
        return true
    }

    if (currentAuthSession != null && hasActiveProjectSubscription(theGraphProject, currentAuthSession.address)) {
        return true
    }

    return false
}
