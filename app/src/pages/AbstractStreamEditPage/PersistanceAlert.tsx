import React from 'react'
import { useCurrentDraft, useDraftId, usePersistingDraftIdsForStream } from '$shared/stores/streamEditor'
import styled from 'styled-components'
import { COLORS } from '$shared/utils/styled'
import Spinner from '$app/src/shared/components/Spinner'

export default function PersistanceAlert() {
    const { streamId } = useCurrentDraft()

    const draftId = useDraftId()

    const isBeingPersistedElsewhere = !!usePersistingDraftIdsForStream(streamId).filter((did) => did !== draftId).length

    if (!isBeingPersistedElsewhere) {
        return null
    }

    return (
        <Root>
            <Copy>This stream is being persisted as we speak. Consider waiting for it to finish before introducing new changes.</Copy>
            <SpinnerWrap>
                <Spinner size="small" color="blue" />
            </SpinnerWrap>
        </Root>
    )
}

const Root = styled.div`
    align-items: center;
    background-color: ${COLORS.secondary};
    border-radius: 8px;
    border: 1px solid ${COLORS.inputBackground};
    color: #323232;
    display: flex;
    font-size: 14px;
    line-height: 1.4em;
    margin-bottom: 24px;
    padding: 24px 32px;
`

const SpinnerWrap = styled.div`
    flex-shrink: 0;
    align-items: center;
    display: flex;
    justify-content: center;
    height: 18px;
    width: 18px;
`

const Copy = styled.div`
    padding-right: 128px;
    flex-grow: 1;
`
