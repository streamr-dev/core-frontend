import React from 'react'
import styled from 'styled-components'
import useCopy from '$shared/hooks/useCopy'
import PrestyledButton from '$shared/components/Button'
import { SM, LG } from '$shared/utils/styled'
import Selector from './Selector'
import Layout from './Layout'

const MobileText = styled.span`
    @media (min-width: ${SM}px) {
        display: none;
    }
`

const TabletText = styled.span`
    display: none;

    @media (min-width: ${SM}px) {
        display: inline-block;
    }
`

const Button = styled(PrestyledButton)`
    && {
        font-size: 12px;
        height: 32px;
        min-width: 80px;
    }

    @media (min-width: ${SM}px) {
        && {
            min-width: 125px;
        }
    }
`

const SettingsButton = styled(Button)`
    @media (max-width: ${LG - 1}px) {
        && {
            display: none;
        }
    }
`

const Lhs = styled.div`
    flex-grow: 1;
    display: grid;
    grid-template-columns: auto 1fr;
`

const Rhs = styled.div`
    display: flex;

    button + button {
        margin-left: 16px;
    }
`

const Inner = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    min-width: 0;
    padding: 0 16px;

    > div:first-child {
        min-width: calc(var(--LiveDataMinLhsWidth) - var(--LiveDataMinMargin) - 16px);
        max-width: calc(var(--LiveDataTimestampColumnMaxWidth));
        width: calc(100vw - var(--LiveDataInspectorWidth) - var(--LiveDataMinMargin) - 16px);
    }
`

const IfEnoughRoom = styled.div`
    display: none;

    @media (min-width: 668px) {
        display: block;
    }
`

const UnstyledToolbar = ({
    className,
    onPartitionChange,
    onSettingsButtonClick,
    onStreamChange,
    partition,
    partitions = [],
    streamId,
    streamIds = [streamId],
    streamLoaded = false,
}) => {
    const { copy, isCopied } = useCopy()

    return (
        <div className={className}>
            <Lhs>
                <Layout.Pusher />
                {!!streamLoaded && (
                    <Inner>
                        <div>
                            <Selector
                                title="Streams"
                                options={streamIds}
                                active={streamId}
                                onChange={onStreamChange}
                            />
                        </div>
                        <IfEnoughRoom>
                            <Selector
                                title="Partitions"
                                options={partitions}
                                active={partition}
                                onChange={onPartitionChange}
                            />
                        </IfEnoughRoom>
                    </Inner>
                )}
            </Lhs>
            <Rhs>
                <div>
                    {typeof onSettingsButtonClick === 'function' && (
                        <SettingsButton
                            kind="secondary"
                            disabled={!streamLoaded}
                            onClick={() => onSettingsButtonClick(streamId)}
                        >
                            Stream Settings
                        </SettingsButton>
                    )}
                    <Button
                        kind="secondary"
                        onClick={() => copy(streamId)}
                        disabled={!streamLoaded}
                    >
                        {isCopied ? (
                            'Copied!'
                        ) : (
                            <React.Fragment>
                                <TabletText>Copy Stream ID</TabletText>
                                <MobileText>Copy Id</MobileText>
                            </React.Fragment>
                        )}
                    </Button>
                </div>
            </Rhs>
        </div>
    )
}

const Toolbar = styled(UnstyledToolbar)`
    align-items: center;
    background: #fdfdfd;
    display: flex;
    height: 64px;
    padding: 0 16px 0 0;
`

Object.assign(Toolbar, {
    Lhs,
    Rhs,
})

export default Toolbar
