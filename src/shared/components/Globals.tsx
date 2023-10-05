import { useCallback } from 'react'
import { useIsPersistingAnyStreamDraft } from '~/shared/stores/streamEditor'
import { useIsAnyPurchaseInProgress } from '~/shared/stores/purchases'
import { useRouteMemoryWipeEffect } from '~/shared/stores/routeMemory'
import usePreventNavigatingAway, {
    useBlockHistoryEffect,
} from '~/shared/hooks/usePreventNavigatingAway'
import { useInfoToastEffect } from '~/hooks'

export default function Globals() {
    const isPersistingAnyStreamDraft = useIsPersistingAnyStreamDraft()

    const isAnyPurchaseInProgress = useIsAnyPurchaseInProgress()

    usePreventNavigatingAway({
        isDirty: useCallback(
            (destination) => {
                if (typeof destination !== 'undefined') {
                    return false
                }

                return isPersistingAnyStreamDraft || isAnyPurchaseInProgress
            },
            [isPersistingAnyStreamDraft, isAnyPurchaseInProgress],
        ),
    })

    useBlockHistoryEffect()

    useRouteMemoryWipeEffect()

    useInfoToastEffect()

    return null
}
