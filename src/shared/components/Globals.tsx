import { useCallback } from 'react'
import { useInfoToastEffect } from '~/hooks'
import usePreventNavigatingAway, {
    useBlockHistoryEffect,
} from '~/shared/hooks/usePreventNavigatingAway'
import { useIsAnyPurchaseInProgress } from '~/shared/stores/purchases'
import { StreamDraft } from '~/stores/streamDraft'
import { useSetSentryScopeEffect } from '~/utils/sentry'

export default function Globals() {
    const isAnyDraftBeingPersisted = StreamDraft.useIsAnyDraftBeingPersisted()

    const isAnyPurchaseInProgress = useIsAnyPurchaseInProgress()

    usePreventNavigatingAway({
        isDirty: useCallback(
            (destination) => {
                if (typeof destination !== 'undefined') {
                    return false
                }

                return isAnyDraftBeingPersisted || isAnyPurchaseInProgress
            },
            [isAnyDraftBeingPersisted, isAnyPurchaseInProgress],
        ),
    })

    useBlockHistoryEffect()

    useInfoToastEffect()

    useSetSentryScopeEffect()

    return null
}
