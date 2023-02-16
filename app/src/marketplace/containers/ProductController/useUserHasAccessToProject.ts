import { useController } from '$mp/containers/ProductController/index'
import { isPaidProject } from '$mp/utils/product'
import useProductSubscription from '$mp/containers/ProductController/useProductSubscription'
import {useIsAuthenticated} from "$auth/hooks/useIsAuthenticated"

export const useUserHasAccessToProject = (): boolean => {
    const { product } = useController()
    const isLoggedIn = useIsAuthenticated()
    const isPaid = isPaidProject(product)
    const {isPurchased, isContractSubscriptionValid, isSubscriptionValid} = useProductSubscription()

    if (!isPaid) {
        return true
    }

    if (!isLoggedIn) {
        return false
    }

    return isPurchased && isContractSubscriptionValid && isSubscriptionValid
}
