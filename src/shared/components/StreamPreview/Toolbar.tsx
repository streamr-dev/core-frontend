import React from 'react'
import styled from 'styled-components'
import PrestyledButton from '~/shared/components/Button'
import { SM, LG } from '~/shared/utils/styled'
import Selector from './Selector'
import Layout from './Layout'

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
        width: calc(
            100vw - var(--LiveDataInspectorWidth) - var(--LiveDataMinMargin) - 16px
        );
    }
`

type Props = {
    className?: string
    onPartitionChange: (partition: number) => void
    onSettingsButtonClick: (streamId: string) => void
    partition: number
    partitions: Array<any>
    streamId: string
}

const UnstyledToolbar = ({
    className,
    onPartitionChange,
    onSettingsButtonClick,
    partition,
    partitions = [],
    streamId,
}: Props) => {
    return (
        <div className={className}>
            <Lhs>
                <Layout.Pusher />
                <Inner>
                    <Selector
                        title="Stream partitions"
                        options={partitions}
                        active={partition}
                        onChange={onPartitionChange}
                    />
                </Inner>
            </Lhs>
            <Rhs>
                <div>
                    {typeof onSettingsButtonClick === 'function' && (
                        <SettingsButton
                            kind="secondary"
                            type={'button'}
                            onClick={() => onSettingsButtonClick(streamId)}
                        >
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
    padding-top: ${(props) => {
        return props.partitions.length > 1 ? '30px ' : '0'
    }};
    padding-bottom: ${(props) => {
        return props.partitions.length > 1 ? '16px ' : '0'
    }};
`
Object.assign(Toolbar, {
    Lhs,
    Rhs,
})
export default Toolbar
