// @flow

import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import cx from 'classnames'

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
            <Translate value="userpages.streams.edit.preview.description" className={styles.longText} tag="p" />
            {!hasData ?
                <p className={styles.longText}>
                    <Translate value="userpages.streams.edit.preview.noDataPre" />
                    <Link to={routes.docsGettingStarted()}>Docs</Link>
                    <Translate value="userpages.streams.edit.preview.noDataEnd" />
                </p>
                : null
            }
            <div
                className={cx(styles.previewContainer, {
                    [styles.hasData]: hasData,
                })}
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
                    >
                        {!isRunning ?
                            <Translate value="userpages.streams.edit.preview.start" /> :
                            <Translate value="userpages.streams.edit.preview.stop" />
                        }
                    </Button>
                    {stream && stream.id && (
                        <Button
                            kind="secondary"
                            className={styles.inspectButton}
                            tag={Link}
                            to={routes.userPageStreamPreview({
                                streamId: stream.id,
                            })}
                        >
                            <Translate value="userpages.streams.edit.preview.inspect" />
                        </Button>
                    )}
                </div>
            </div>
        </ClientProvider>
    )
}

export default PreviewView
