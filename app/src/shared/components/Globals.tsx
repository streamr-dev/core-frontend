import { useIsPersistingAnyStreamDraft } from '$shared/stores/streamEditor'
import usePreventNavigatingAway from '../hooks/usePreventNavigatingAway'

export default function Globals() {
    const isPersistingAnyStreamDraft = useIsPersistingAnyStreamDraft()

    usePreventNavigatingAway({
        isDirty(destination) {
            return typeof destination === 'undefined' && isPersistingAnyStreamDraft
        }
    })

    return null
}
