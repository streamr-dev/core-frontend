// @flow

import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'

import type { Stream } from '$shared/flowtype/stream-types'
import type { User } from '$shared/flowtype/user-types'
import Button from '$shared/components/Button'
import StreamLivePreview from '$mp/components/StreamPreviewPage/StreamLivePreview'
import routes from '$routes'
import { Provider as ClientProvider } from '$shared/contexts/StreamrClient'

import styles from './previewView.pcss'

type Props = {
    stream: ?Stream,
    currentUser: ?User,
}

const PreviewView = ({ stream, currentUser }: Props) => {
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
            <div
                className={styles.previewContainer}
            >
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
                <div className={styles.previewControls}>
                    <Button
                        kind="secondary"
                        className={styles.playPauseButton}
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
                        className={styles.inspectButton}
                        tag={Link}
                        to={routes.userPageStreamPreview({
                            streamId: stream.id,
                        })}
                        disabled={!hasData}
                    >
                        <Translate value="userpages.streams.edit.preview.inspect" />
                    </Button>
                </div>
            </div>
        </ClientProvider>
    )
}

export default PreviewView
