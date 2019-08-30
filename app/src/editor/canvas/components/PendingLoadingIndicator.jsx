import React from 'react'
import { useAnyPending } from '$shared/hooks/usePending'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import styles from './PendingLoadingIndicator.pcss'

export default function PendingLoadingIndicator() {
    const isPending = useAnyPending()
    return (
        <LoadingIndicator className={styles.root} loading={isPending} />
    )
}
