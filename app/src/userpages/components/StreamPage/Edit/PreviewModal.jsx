import React from 'react'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import StreamPreview from '$mp/components/StreamPreviewPage/StreamPreview'

const FullPage = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(239, 239, 239, 0.98);
    z-index: 1;
    overflow-y: scroll;
`

const StreamPreviewDialog = ({ onClose, streamId, stream, streamData }) => (
    <ModalPortal>
        <ModalDialog onClose={onClose}>
            <FullPage>
                <StreamPreview
                    streamId={streamId}
                    stream={stream}
                    onClose={onClose}
                    streamData={streamData}
                />
            </FullPage>
        </ModalDialog>
    </ModalPortal>
)

export default StreamPreviewDialog
