import React, { useCallback, useEffect, useState, useReducer } from 'react'
import { useClient } from 'streamr-client-react'
import styled, { css } from 'styled-components'
import Checkbox from '$shared/components/Checkbox'
import Spinner from '$shared/components/Spinner'
import useStreamId from '$shared/hooks/useStreamId'
import useInterrupt from '$shared/hooks/useInterrupt'
import Notification from '$shared/utils/Notification'
import { NotificationIcon, networks } from '$shared/utils/constants'
import useValidateNetwork from '$shared/hooks/useValidateNetwork'
import { useStreamEditorStore } from '../state'

type Props = {
    address: string,
    active: boolean,
    className?: string,
    disabled: boolean,
    children: React.ReactNode,
}

function UnstyledStorageNodeItem({ address, active: activeProp, className, disabled = false, children }: Props) {
    const [{ active = activeProp, cache }, setActive] = useReducer(
        (state, newActive) => ({
            active: newActive,
            cache: (state.cache || 0) + 1,
        }),
        {},
    )
    const addStorageNode = useStreamEditorStore((state) => state.addStorageNode)
    const removeStorageNode = useStreamEditorStore((state) => state.removeStorageNode)
    useEffect(() => {
        setActive(activeProp)
    }, [activeProp])
    const client = useClient()
    const streamId = useStreamId()
    const itp = useInterrupt()
    const [busy, setBusy] = useState(typeof active === 'undefined')
    const validateNetwork = useValidateNetwork()
    const onClick = useCallback(async () => {
        if (disabled) {
            return
        }

        const { requireUninterrupted } = itp()

        if (typeof active === 'undefined') {
            return
        }

        setBusy(true)
        let success = false

        try {
            try {
                await validateNetwork(networks.STREAMS)
                requireUninterrupted()
                if (active) {
                    removeStorageNode(address)
                } else {
                    addStorageNode(address)
                }
                success = true
            } catch (e) {
                console.warn(e)
                Notification.push({
                    title: 'Failed to toggle a storage node',
                    icon: NotificationIcon.ERROR,
                })
            }

            requireUninterrupted()
        } catch (e) {
            // The only error that can happen above is the `InterruptionError`. No better moment
            // to skip the rest.
            return
        }

        setActive(success ? !active : active)
    }, [itp, address, active, validateNetwork, addStorageNode, removeStorageNode, disabled])
    useEffect(
        () => () => {
            // Ignore the result of any in-the-air toggling if conditions change.
            itp().interruptAll()
        },
        [itp, client, address, streamId, active],
    )
    useEffect(() => {
        setBusy(typeof active === 'undefined')
    }, [active, cache])
    return (
        <Root className={className} onClick={onClick} title={children} type="button" $active={active} disabled={disabled}>
            <div>{children}</div>
            {!disabled && !busy && (
                <Checkbox.Tick checked={active} data-test-hook={active ? 'Checkbox on' : 'Checkbox off'} />
            )}
            {busy && <Spinner color="gray" />}
        </Root>
    )
}

const StorageNodeItem = styled(UnstyledStorageNodeItem)`
    align-items: center;
    appearance: none;
    background: #ffffff;
    border: 1px solid #efefef;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    font-size: 16px;
    height: 40px;
    line-height: normal;
    padding: 0 16px;
    text-align: left;
    transition: color 0.1s;
    width: 100%;

    :disabled,
    &[disabled] {
        background: #efefef;
        border-color: #efefef;
    }

    :focus {
        outline: 0;
    }

    & + & {
        margin-top: 16px;
    }

    > div:first-child {
        flex-grow: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    ${Checkbox.Tick} {
        flex-shrink: 0;
        margin-left: 12px;
    }
`
const Root = styled.button`
    color: #cdcdcd;
    cursor: pointer;

    :disabled,
    &[disabled] {
        cursor: not-allowed;
    }

    ${({ $active }) =>
        !!$active &&
        css`
            color: #323232;
        `}

    ${({ $active }) =>
        typeof $active === 'undefined' &&
        css`
            cursor: default !important;
        `}
`
export default StorageNodeItem
