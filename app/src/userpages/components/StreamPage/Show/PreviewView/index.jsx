// @flow

import React, { Component, Fragment } from 'react'
import { Button } from 'reactstrap'

import type { Stream } from '$shared/flowtype/stream-types'
import StreamLivePreview from '$mp/components/StreamPreviewPage/StreamLivePreview'
import Modal from '$shared/components/Modal'
import SvgIcon from '$shared/components/SvgIcon'

import InspectView from './InspectView'
import styles from './previewView.pcss'

type Props = {
    stream: ?Stream,
}

type State = {
    isRunning: boolean,
    isInspecting: boolean,
}

export class PreviewView extends Component<Props, State> {
    state = {
        isRunning: true,
        isInspecting: false,
    }

    onToggleRun = () => {
        this.setState({
            isRunning: !this.state.isRunning,
        })
    }

    onInspectOpen = () => {
        this.setState({
            isInspecting: true,
        })
    }

    onInspectClose = () => {
        this.setState({
            isInspecting: false,
        })
    }

    render() {
        const { stream } = this.props
        const { isRunning, isInspecting } = this.state

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
                        <Button color="userpages" onClick={this.onInspectOpen}>
                            Inspect
                        </Button>
                    </div>
                    <StreamLivePreview
                        key={stream.id}
                        streamId="7wa7APtlTq6EC5iTCBy6dw"
                        currentUser={null}
                        apiKey={null}
                        onSelectDataPoint={() => {}}
                        selectedDataPoint={null}
                        run={isRunning}
                    />
                    {isInspecting && (
                        <Modal>
                            <InspectView
                                stream={stream}
                                onClose={this.onInspectClose}
                            />
                        </Modal>
                    )}
                </Fragment>
            )
        }

        return null
    }
}

export default PreviewView
