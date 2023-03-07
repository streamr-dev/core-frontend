import React, { useState, useMemo, Fragment } from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS } from '$shared/utils/styled'
import Errors from '$ui/Errors'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import Button from '$shared/components/Button'
import IconButton from './IconButton'
import Feed from './Feed'
import Foot from './Foot'
import Selector from './Selector'

type InspectorButtonProps = {
    active: boolean,
}

const InspectorButton = styled(IconButton)<InspectorButtonProps>`
    width: 32px;
    height: 32px;
    text-align: center;
    position: relative;
    border: none;
    background: none;
    appearance: none;
    border-radius: 2px;
    color: #cdcdcd;

    &:hover,
    &:active,
    &:focus {
        background-color: #efefef;
        color: #525252;
    }

    ${({ active }) =>
        !!active &&
        css`
            background-color: #efefef;
            color: #525252;
        `}
`

type Props = {
    activePartition?: number,
    className?: string,
    dataError?: string,
    loading?: boolean,
    streamId?: string,
    navigableStreamIds?: Array<string>,
    onChange?: () => void,
    onPartitionChange?: (partition: number) => void,
    onStreamSettings?: () => void,
    stream?: any,
    streamData?: any,
    hasSubscribePermission: boolean,
}

const UnstyledStreamPreview = ({
    activePartition = 0,
    className,
    dataError,
    loading = false,
    streamId,
    navigableStreamIds = [streamId],
    onChange: onStreamChange,
    onPartitionChange,
    onStreamSettings,
    stream,
    streamData,
    hasSubscribePermission,
}: Props) => {
    const [inspectorFocused, setInspectorFocused] = useState(false)
    const streamLoaded = !!(stream && stream.id === streamId)
    const { partitions } = stream || {}
    const partitionOptions = useMemo(
        () => (partitions ? [...new Array(partitions)].map((_, index) => index) : undefined),
        [partitions],
    )
    return (
        <>
            <LoadingIndicator loading={!streamLoaded || !!loading} />
            <Feed
                className={className}
                inspectorFocused={inspectorFocused}
                stream={stream}
                streamData={streamData}
                streamLoaded={streamLoaded}
                errorComponent={
                    <Fragment>
                        {!!dataError && <Errors>{dataError}</Errors>}
                    </Fragment>
                }
                onPartitionChange={onPartitionChange}
                onSettingsButtonClick={onStreamSettings}
                onStreamChange={onStreamChange}
                partition={activePartition}
                partitions={partitionOptions || []}
                streamId={streamId}
                streamIds={navigableStreamIds || []}
                hasSubscribePermission={hasSubscribePermission}
            />
            <Foot>
                <div>
                    <InspectorButton
                        active={!inspectorFocused}
                        onClick={() => setInspectorFocused(false)}
                        type="button"
                    >
                        <SvgIcon name="list" />
                    </InspectorButton>
                </div>
                <div>
                    <InspectorButton
                        active={!!inspectorFocused}
                        onClick={() => setInspectorFocused(true)}
                        type="button"
                    >
                        <SvgIcon name="listInspect" />
                    </InspectorButton>
                </div>
                {!inspectorFocused && !!streamLoaded && (
                    <div>
                        <Selector
                            title="Partitions"
                            options={partitionOptions || []}
                            active={activePartition}
                            onChange={onPartitionChange}
                        />
                    </div>
                )}
            </Foot>
        </>
    )
}

const StreamPreview = styled(UnstyledStreamPreview)`
    background: #ffffff;
    color: #323232;
    font-size: 14px;
    border-top: 1px solid ${COLORS.separator};
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
