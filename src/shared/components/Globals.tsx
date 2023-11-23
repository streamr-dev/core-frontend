import { useCallback } from 'react'
import { useIsPersistingAnyStreamDraft } from '~/shared/stores/streamEditor'
import { useIsAnyPurchaseInProgress } from '~/shared/stores/purchases'
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

    useInfoToastEffect()

    return null
}
