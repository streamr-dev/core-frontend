// @flow

import React, { Component, Fragment } from 'react'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'

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
}

export class PreviewView extends Component<Props, State> {
    state = {
        isRunning: true,
    }

    onToggleRun = () => {
        this.setState(({ isRunning }) => ({
            isRunning: !isRunning,
        }))
    }

    render() {
        const { stream, currentUser, authApiKeyId } = this.props
        const { isRunning } = this.state

        if (stream) {
            return (
                <Fragment>
                    <div className={styles.buttonContainer}>
                        <Button color="userpages" className={styles.toggleButton} onClick={this.onToggleRun}>
                            {!isRunning ?
                                <SvgIcon name="play" className={styles.icon} /> :
                                <SvgIcon name="pause" className={styles.icon} />
                            }
                        </Button>
                        {stream && stream.id && (
                            <Button
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
                    />
                </Fragment>
            )
        }

        return null
    }
}

export default PreviewView
