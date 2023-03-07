import { isPaidProject } from '$mp/utils/product'
import useProjectSubscription from '$mp/containers/ProductController/useProjectSubscription'
import {useIsAuthenticated} from "$auth/hooks/useIsAuthenticated"
import {useLoadedProject} from "$mp/contexts/LoadedProjectContext"

export const useUserHasAccessToProject = (): boolean => {
    const { loadedProject: project } = useLoadedProject()
    const isLoggedIn = useIsAuthenticated()
    const isPaid = isPaidProject(project)
    const {isPurchased, isContractSubscriptionValid, isSubscriptionValid} = useProjectSubscription()

    if (!isPaid) {
        return true
    }

    if (!isLoggedIn) {
        return false
    }

    return isPurchased && isContractSubscriptionValid && isSubscriptionValid
}
