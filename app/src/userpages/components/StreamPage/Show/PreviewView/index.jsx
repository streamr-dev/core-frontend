// @flow

import React, { Component, Fragment } from 'react'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'
import type { User } from '$shared/flowtype/user-types'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'
import StreamLivePreview from '$mp/components/StreamPreviewPage/StreamLivePreview'
import SvgIcon from '$shared/components/SvgIcon'
import routes from '$routes'

import styles from './previewView.pcss'

type Props = {
    stream: ?Stream,
    currentUser: ?User,
    authApiKeyId: ?ResourceKeyId,
}

type State = {
    isRunning: boolean,
    hasData: boolean,
}

export class PreviewView extends Component<Props, State> {
    state = {
        isRunning: true,
        hasData: false,
    }

    onToggleRun = () => {
        this.setState(({ isRunning }) => ({
            isRunning: !isRunning,
        }))
    }

    setHasData = () => {
        this.setState(() => ({
            hasData: true,
        }))
    }

    render() {
        const { stream, currentUser, authApiKeyId } = this.props
        const { isRunning, hasData } = this.state

        if (stream) {
            return (
                <Fragment>
                    <Translate value="userpages.streams.edit.preview.description" className={styles.longText} tag="p" />
                    {!hasData ?
                        <Fragment>
                            <Translate value="userpages.streams.edit.preview.noDataPre" />
                            <Link to={routes.docsGettingStarted()}>Docs</Link>
                            <Translate value="userpages.streams.edit.preview.noDataEnd" />
                        </Fragment>
                        : null
                    }
                    <div
                        className={cx(styles.previewContainer, {
                            [styles.hasData]: hasData,
                        })}
                    >
                        <div className={styles.previewControls}>
                            <Button color="userpages" className={styles.playPauseButton} onClick={this.onToggleRun}>
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
                            authApiKeyId={authApiKeyId}
                            onSelectDataPoint={() => {}}
                            selectedDataPoint={null}
                            run={isRunning}
                            userpagesPreview
                            hasData={this.setHasData}
                        />
                    </div>
                </Fragment>
            )
        }

        return null
    }
}

export default PreviewView
