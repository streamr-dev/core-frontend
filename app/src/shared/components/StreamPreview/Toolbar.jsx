import React from 'react'
import styled from 'styled-components'
import { Translate, I18n } from 'react-redux-i18n'
import useCopy from '$shared/hooks/useCopy'
import PrestyledButton from '$shared/components/Button'
import Selector from './Selector'
import Layout from './Layout'
import { SM, LG } from '$shared/utils/styled'

const MobileText = styled(Translate)`
    @media (min-width: ${SM}px) {
        display: none;
    }
`

const TabletText = styled(Translate)`
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
        min-width: calc(var(--LiveDataMinLhsWidth) - 108px);
        max-width: 360px;
        width: calc(100vw - var(--LiveDataInspectorWidth, 504px) - 108px);
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
                <Inner>
                    <div>
                        <Selector
                            title={I18n.t('streamLivePreview.streams')}
                            options={streamIds}
                            active={streamId}
                            onChange={onStreamChange}
                        />
                    </div>
                    <div>
                        <Selector
                            title={I18n.t('streamLivePreview.partitions')}
                            options={partitions}
                            active={partition}
                            onChange={onPartitionChange}
                        />
                    </div>
                </Inner>
            </Lhs>
            <Rhs>
                <div>
                    {typeof onSettingsButtonClick === 'function' && (
                        <SettingsButton
                            kind="secondary"
                            disabled={!streamLoaded}
                            onClick={() => onSettingsButtonClick(streamId)}
                        >
                            <Translate value="streamLivePreview.streamSettings" />
                        </SettingsButton>
                    )}
                    <Button
                        kind="secondary"
                        onClick={() => copy(streamId)}
                        disabled={!streamLoaded}
                    >
                        {isCopied ? (
                            <Translate value="streamLivePreview.streamIdCopied" />
                        ) : (
                            <React.Fragment>
                                <TabletText value="streamLivePreview.copyStreamId" />
                                <MobileText value="streamLivePreview.copyStreamIdMobile" />
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
