import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { selectSubscriptions } from '$mp/modules/myPurchaseList/selectors'
import { selectContractSubscription } from '$mp/modules/product/selectors'
import { isActive } from '$mp/utils/time'
import { useController } from '.'

export default function useProductSubscription() {
    const { product } = useController()
    const productId = product && product.id
    const subscriptions = useSelector(selectSubscriptions)
    const contractSubscription = useSelector(selectContractSubscription)

    const isPurchased = useMemo(() => {
        if (!productId || !subscriptions) {
            return false
        }

        const subscription = subscriptions && subscriptions.find((s) => s.id === productId)

        return !!subscription && isActive(subscription.endsAt || '')
    }, [productId, subscriptions])

    const isContractSubscriptionValid = useMemo(() => (
        contractSubscription != null ? isActive(moment(contractSubscription.endTimestamp, 'X')) : false
    ), [contractSubscription])

    const isSubscriptionValid = useMemo(() => (
        isPurchased || isContractSubscriptionValid
    ), [isPurchased, isContractSubscriptionValid])

    return useMemo(() => ({
        isPurchased,
        isContractSubscriptionValid,
        isSubscriptionValid,
        contractSubscription,
    }), [
        isPurchased,
        isContractSubscriptionValid,
        isSubscriptionValid,
        contractSubscription,
    ])
}
