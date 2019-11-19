// @flow

import React, { useState, useCallback } from 'react'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'
import type { User } from '$shared/flowtype/user-types'
import StreamLivePreview from '$mp/components/StreamPreviewPage/StreamLivePreview'
import SvgIcon from '$shared/components/SvgIcon'
import routes from '$routes'
import { ClientProvider } from '$shared/components/StreamrClientContextProvider'

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
                <div className={styles.previewControls}>
                    <Button color="userpages" className={styles.playPauseButton} onClick={onToggleRun}>
                        {!isRunning ?
                            <SvgIcon name="play" className={styles.icon} /> :
                            <SvgIcon name="pause" className={styles.icon} />
                        }
                    </Button>
                    {stream && stream.id && (
                        <Button
                            className={styles.inspectButton}
                            color="userpages"
                            tag={Link}
                            to={routes.userPageStreamPreview({
                                streamId: stream.id,
                            })}
                        >
                            <Translate value="userpages.streams.edit.preview.inspect" />
                        </Button>
                    )}
                </div>
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
            </div>
        </ClientProvider>
    )
}

export default PreviewView
