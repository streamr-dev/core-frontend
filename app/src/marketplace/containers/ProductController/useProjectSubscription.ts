import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { selectSubscriptions } from '$mp/modules/myPurchaseList/selectors'
import { selectContractSubscription } from '$mp/modules/product/selectors'
import { isActive } from '$mp/utils/time'
import {useLoadedProject} from "$mp/contexts/LoadedProjectContext"

export default function useProjectSubscription() {
    const {loadedProject: project} = useLoadedProject()
    const projectId = project && project.id
    const subscriptions = useSelector(selectSubscriptions)
    const contractSubscription = useSelector(selectContractSubscription)
    const isPurchased = useMemo(() => {
        if (!projectId || !subscriptions) {
            return false
        }

        const subscription = subscriptions && subscriptions.find((s) => s.id === projectId)
        return !!subscription && isActive(subscription.endsAt || '')
    }, [projectId, subscriptions])
    const isContractSubscriptionValid = useMemo(
        () => (contractSubscription != null ? isActive(moment(contractSubscription.endTimestamp, 'X')) : false),
        [contractSubscription],
    )
    const isSubscriptionValid = useMemo(
        () => isPurchased || isContractSubscriptionValid,
        [isPurchased, isContractSubscriptionValid],
    )
    return useMemo(
        () => ({
            isPurchased,
            isContractSubscriptionValid,
            isSubscriptionValid,
            contractSubscription,
        }),
        [isPurchased, isContractSubscriptionValid, isSubscriptionValid, contractSubscription],
    )
}
