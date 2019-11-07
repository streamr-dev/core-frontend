// @flow

import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'
import type { User } from '$shared/flowtype/user-types'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'
import Button from '$shared/components/Button'
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
    unmounted = false

    state = {
        isRunning: true,
        hasData: false,
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    onToggleRun = () => {
        if (this.unmounted) { return }
        this.setState(({ isRunning }) => ({
            isRunning: !isRunning,
        }))
    }

    setHasData = () => {
        if (this.unmounted) { return }
        this.setState({
            hasData: true,
        })
    }

    render() {
        const { stream, currentUser, authApiKeyId } = this.props
        const { isRunning, hasData } = this.state

        if (stream) {
            return (
                <Fragment>
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
                            <Button
                                type="secondary"
                                outline
                                className={styles.playPauseButton}
                                onClick={this.onToggleRun}
                            >
                                {!isRunning ?
                                    <SvgIcon name="play" className={styles.icon} /> :
                                    <SvgIcon name="pause" className={styles.icon} />
                                }
                            </Button>
                            {stream && stream.id && (
                                <Button
                                    type="secondary"
                                    outline
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
