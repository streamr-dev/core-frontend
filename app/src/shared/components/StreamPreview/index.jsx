import React, { useState, useMemo, Fragment } from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import { SM } from '$shared/utils/styled'
import Errors from '$ui/Errors'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import IconButton from './IconButton'
import Toolbar from './Toolbar'
import Feed from './Feed'
import Foot from './Foot'
import Head from './Head'

const Container = styled.div`
    position: relative;
    height: 100%;
    background-color: white;
    color: #525252;
`

const MobileInspectorPanel = styled.div`
    align-items: center;
    background-color: white;
    bottom: 0;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    height: 80px;
    left: 0;
    padding: 0 24px;
    position: fixed;
    width: 100%;

    @media (min-width: ${SM}px) {
        display: none;
    }
`

const InspectorButton = styled(IconButton)`
    width: 32px;
    height: 32px;
    text-align: center;
    position: relative;
    border: none;
    background: none;
    appearance: none;
    border-radius: 2px;
    color: #CDCDCD;

    &:hover,
    &:active,
    &:focus {
        background-color: #EFEFEF;
        color: #525252;
    }

    ${({ active }) => !!active && css`
        background-color: #EFEFEF;
        color: #525252;
    `}
`

const UnstyledStreamPreview = ({
    activePartition = 0,
    className,
    dataError,
    loading = false,
    streamId,
    navigableStreamIds = [streamId],
    onClose,
    onPartitionChange,
    onStreamSettings,
    stream,
    streamData,
    subscriptionError,
    titlePrefix,
}) => {
    const [inspectorFocused, setInspectorFocused] = useState(false)

    const streamLoaded = !!(stream && stream.id === streamId)

    const { description, partitions } = stream || {}

    const partitionOptions = useMemo(() => (
        partitions ? (
            [...new Array(partitions)].map((_, index) => index)
        ) : (
            undefined
        )
    ), [partitions])

    return (
        <div className={className}>
            <Head
                description={description}
                onCloseClick={onClose}
                skeletonize={!streamLoaded}
                streamId={streamId}
                titlePrefix={titlePrefix}
            />
            <Toolbar
                onPartitionChange={onPartitionChange}
                onSettingsButtonClick={onStreamSettings}
                partition={activePartition}
                partitions={partitionOptions || []}
                streamId={streamId}
                streamIds={navigableStreamIds || []}
                streamLoaded={streamLoaded}
            />
            <LoadingIndicator loading={!streamLoaded || !!loading} />
            <Feed
                stream={stream}
                streamData={streamData}
                streamLoaded={streamLoaded}
                errorComponent={(
                    <Fragment>
                        {!!subscriptionError && (
                            <Errors>{subscriptionError}</Errors>
                        )}
                        {!!dataError && (
                            <Errors>{dataError}</Errors>
                        )}
                    </Fragment>
                )}
            />
            <Foot />
        </div>
    )

    // eslint-disable-next-line no-unreachable
    return (
        <Container>
            <MobileInspectorPanel>
                <InspectorButton
                    active={!inspectorFocused}
                    onClick={() => setInspectorFocused(false)}
                >
                    <SvgIcon name="list" />
                </InspectorButton>
                <InspectorButton
                    active={!!inspectorFocused}
                    onClick={() => setInspectorFocused(true)}
                >
                    <SvgIcon name="listInspect" />
                </InspectorButton>
            </MobileInspectorPanel>
        </Container>
    )
}

const StreamPreview = styled(UnstyledStreamPreview)`
    background: #ffffff;
    color: #323232;
    display: flex;
    flex-direction: column;
    height: 100%;

    ${Errors} {
        margin: 20px 40px 0;
    }

    ${Errors} + ${Errors} {
        margin-top: 1em;
    }

    ${Errors}:last-child {
        padding-bottom: 20px;
    }
`

export default StreamPreview
