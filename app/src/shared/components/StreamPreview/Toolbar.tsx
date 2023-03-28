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
    display: flex;
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

type Props = {
    className?: string,
    onPartitionChange: (partition: number) => void,
    onSettingsButtonClick: (streamId: string) => void,
    partition: number,
    partitions: Array<any>,
    streamId: string
}

const UnstyledToolbar = ({
    className,
    onPartitionChange,
    onSettingsButtonClick,
    partition,
    partitions = [],
    streamId
}: Props) => {
    const { copy, isCopied } = useCopy()
    return (
        <div className={className}>
            <Lhs>
                <Layout.Pusher />
                <Inner>
                    <Selector
                        title="Partitions"
                        options={partitions}
                        active={partition}
                        onChange={onPartitionChange}
                    />
                </Inner>
            </Lhs>
            <Rhs>
                <div>
                    {typeof onSettingsButtonClick === 'function' && (
                        <SettingsButton kind="secondary" type={'button'} onClick={() => onSettingsButtonClick(streamId)}>
                            Stream Settings
                        </SettingsButton>
                    )}
                </div>
            </Rhs>
        </div>
    )
}

const Toolbar = styled(UnstyledToolbar)`
    align-items: center;
    display: flex;
    padding-top: 58px;
`
Object.assign(Toolbar, {
    Lhs,
    Rhs,
})
export default Toolbar
