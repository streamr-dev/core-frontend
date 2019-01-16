// @flow

import React, { Component } from 'react'
import { Button } from 'reactstrap'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import BodyClass, { NO_SCROLL } from '$shared/components/BodyClass'
import type { Stream } from '$shared/flowtype/stream-types'
import StreamLivePreview, { type DataPoint } from '$mp/components/StreamPreviewPage/StreamLivePreview'
import InspectorSidebar from '$mp/components/StreamPreviewPage/InspectorSidebar'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './inspectView.pcss'

type Props = {
    stream: ?Stream,
    onClose: () => void,
}

type State = {
    selectedDataPoint: ?DataPoint,
}

export class PreviewView extends Component<Props, State> {
    state = {
        selectedDataPoint: null,
    }

    onSelectDataPoint = (dataPoint: DataPoint) => {
        this.setState({
            selectedDataPoint: dataPoint,
        })
    }

    render() {
        const { stream, onClose } = this.props
        const { selectedDataPoint } = this.state

        if (stream) {
            return (
                <div className={styles.container}>
                    <BodyClass className={NO_SCROLL} />
                    <Button className={styles.closeButton} onClick={onClose}>
                        <SvgIcon name="cross" className={styles.closeIcon} />
                    </Button>
                    <div className={styles.tableContainer}>
                        <p className={styles.title}>
                            <Translate value="modal.streamLiveData.liveData" />
                        </p>
                        <StreamLivePreview
                            key={stream.id}
                            streamId="7wa7APtlTq6EC5iTCBy6dw"
                            currentUser={null}
                            apiKey={null}
                            onSelectDataPoint={this.onSelectDataPoint}
                            selectedDataPoint={selectedDataPoint}
                        />
                    </div>
                    <div className={cx(styles.sidebar)}>
                        <InspectorSidebar
                            streamId={stream.id}
                            currentUser={null}
                            dataPoint={selectedDataPoint}
                            onStreamIdCopy={() => {}}
                        />
                    </div>
                </div>
            )
        }

        return null
    }
}

export default PreviewView
