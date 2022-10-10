import React, { FunctionComponent } from 'react'
import SnippetDialogComponent from '$userpages/components/SnippetDialog/index'
import useModal from '$shared/hooks/useModal'
import { subscribeSnippets } from '$utils/streamSnippets'
const SnippetDialog: FunctionComponent = () => {
    const { api, isOpen, value: { streamId } = {} } = useModal('userpages.streamSnippet')
    return (
        !!isOpen && (
            <SnippetDialogComponent
                snippets={subscribeSnippets({
                    id: streamId,
                })}
                onClose={() => void api.close()}
            />
        )
    )
}

export default SnippetDialog
