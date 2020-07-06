// @flow

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'

import type { Stream } from '$shared/flowtype/stream-types'
import type { User } from '$shared/flowtype/user-types'
import Button from '$shared/components/Button'
import StreamLivePreview from '$mp/components/StreamPreviewPage/StreamLivePreview'
import routes from '$routes'
import { Provider as ClientProvider } from '$shared/contexts/StreamrClient'

type Props = {
    stream: ?Stream,
    currentUser: ?User,
}

const Controls = styled.div`
    align-items: center;
    border: solid #ebebeb;
    border-width: 0 1px 1px;
    display: flex;
    justify-content: flex-end;
    padding: 1rem;

    > * + * {
        margin-left: 1rem;
    }
`

const UnstyledPreviewView = ({ stream, currentUser, ...props }: Props) => {
    const [isRunning, setIsRunning] = useState(true)

    const [hasData, setHasData] = useState(false)

    const onToggleRun = useCallback(() => {
        setIsRunning((wasRunning) => !wasRunning)
    }, [setIsRunning])

    if (!stream || !stream.id) {
        return null
    }

    return (
        <ClientProvider>
            <div {...props}>
                <StreamLivePreview
                    key={stream.id}
                    streamId={stream.id}
                    currentUser={currentUser}
                    onSelectDataPoint={() => {}}
                    selectedDataPoint={null}
                    run={isRunning}
                    userpagesPreview
                    hasData={() => setHasData(true)}
                />
                <Controls>
                    <Button
                        kind="secondary"
                        onClick={onToggleRun}
                        disabled={!hasData}
                    >
                        {!isRunning ?
                            <Translate value="userpages.streams.edit.preview.start" /> :
                            <Translate value="userpages.streams.edit.preview.stop" />
                        }
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        to={routes.streams.preview({
                            streamId: stream.id,
                        })}
                        disabled={!hasData}
                    >
                        <Translate value="userpages.streams.edit.preview.inspect" />
                    </Button>
                </Controls>
            </div>
        </ClientProvider>
    )
}

const PreviewView = styled(UnstyledPreviewView)`
    background-color: #fdfdfd;
    display: grid;
    grid-template-rows: 1fr 72px;
    position: relative;
`

export default PreviewView
