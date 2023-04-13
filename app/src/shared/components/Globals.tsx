import { useIsPersistingAnyStreamDraft } from '$shared/stores/streamEditor'
import usePreventNavigatingAway from '../hooks/usePreventNavigatingAway'
import { useRouteMemoryWipeEffect } from '../stores/routeMemory'

export default function Globals() {
    const isPersistingAnyStreamDraft = useIsPersistingAnyStreamDraft()

    usePreventNavigatingAway({
        isDirty(destination) {
            return typeof destination === 'undefined' && isPersistingAnyStreamDraft
        }
    })

    useRouteMemoryWipeEffect()

    return null
}
