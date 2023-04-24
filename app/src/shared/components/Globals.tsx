import { useIsPersistingAnyStreamDraft } from '$shared/stores/streamEditor'
import { useIsAnyPurchaseInProgress } from '$shared/stores/purchases'
import { useRouteMemoryWipeEffect } from '$shared/stores/routeMemory'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'

export default function Globals() {
    const isPersistingAnyStreamDraft = useIsPersistingAnyStreamDraft()

    const isAnyPurchaseInProgress = useIsAnyPurchaseInProgress()

    usePreventNavigatingAway({
        isDirty(destination) {
            if (typeof destination !== 'undefined') {
                return false
            }

            return isPersistingAnyStreamDraft || isAnyPurchaseInProgress
        }
    })

    useRouteMemoryWipeEffect()

    return null
}
