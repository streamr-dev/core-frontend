import { useSelector } from 'react-redux'
import { selectUserData } from '$shared/modules/user/selectors'
import { useController } from '$mp/containers/ProductController/index'
import { isPaidProduct } from '$mp/utils/product'
import useProductSubscription from '$mp/containers/ProductController/useProductSubscription'

export const useUserHasAccessToProject = (): boolean => {
    const { product } = useController()
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const isPaid = isPaidProduct(product)
    const {isPurchased, isContractSubscriptionValid, isSubscriptionValid} = useProductSubscription()

    if (!isPaid) {
        return true
    }

    if (!isLoggedIn) {
        return false
    }

    return isPurchased && isContractSubscriptionValid && isSubscriptionValid
}
