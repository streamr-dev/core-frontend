import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'

export default function ChangeLossWatcher() {
    const { clean } = useStreamModifierStatusContext()

    usePreventNavigatingAway(
        'You have unsaved changes. Are you sure you want to leave?',
        () => !clean,
    )

    return null
}
