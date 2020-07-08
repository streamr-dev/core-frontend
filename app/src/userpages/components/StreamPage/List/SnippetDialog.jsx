// @flow

import React, { useMemo, useCallback } from 'react'

import SnippetDialogComponent from '$userpages/components/SnippetDialog/index'
import useModal from '$shared/hooks/useModal'
import { subscribeSnippets } from '$utils/streamSnippets'
import type { StreamId } from '$shared/flowtype/stream-types'

type Props = {
    api: Object,
    streamId: StreamId,
}

const SnippetDialog = ({ api, streamId }: Props) => {
    const onClose = useCallback(() => {
        api.close()
    }, [api])

    const snippets = useMemo(() => subscribeSnippets({
        id: streamId,
    }), [streamId])

    return (
        <SnippetDialogComponent
            snippets={snippets}
            onClose={onClose}
        />
    )
}

export default () => {
    const { api, isOpen, value } = useModal('userpages.streamSnippet')

    if (!isOpen) {
        return null
    }

    const { streamId } = value || {}

    return (
        <SnippetDialog
            api={api}
            streamId={streamId}
        />
    )
}
