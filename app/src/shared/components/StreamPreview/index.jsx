import React, { useState, useMemo } from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import { SM } from '$shared/utils/styled'
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
    position: fixed;
    bottom: 0;
    height: 80px;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 24px;

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

const ErrorNotice = styled.div`
    flex: 1;
    font-size: 12px;
    color: #808080;
    margin: 16px 24px;

    @media (min-width: ${SM}px) {
        margin: 16px 32px 16px 40px;
    }

    p {
        margin: 0;
        line-height: 1.5rem;
    }
`

const UnstyledStreamPreview = ({
    className,
    streamId,
    stream,
    navigableStreamIds = [streamId],
    titlePrefix,
    onStreamSettings,
    streamData,
    onClose,
    activePartition = 0,
    onPartitionChange,
    loading = false,
    subscriptionError,
    dataError,
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
            />
            <Foot />
        </div>
    )

    // eslint-disable-next-line no-unreachable
    return (
        <Container>
            {(!!subscriptionError || dataError) && (
                <ErrorNotice>
                    {!!subscriptionError && (
                        <p>{subscriptionError}</p>
                    )}
                    {!!dataError && (
                        <p>{dataError}</p>
                    )}
                </ErrorNotice>
            )}
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
`

export default StreamPreview
