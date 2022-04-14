import React, { Fragment, useEffect, useReducer, useRef } from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import StatusLabel from '$shared/components/StatusLabel'
import TOCPage from '$shared/components/TOCPage'
import { useTransientStream } from '$shared/contexts/TransientStreamContext'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import Label from '$ui/Label'
import Numeric from '$ui/Numeric'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'

const PARTITIONS_MIN = 1

const PARTITIONS_MAX = 99

const Init = 'init'

const SetValue = 'set value'

function reducer(state, { type, payload }) {
    switch (type) {
        case Init:
            return {
                cache: 0,
                initializer: payload,
                sanitizedValue: payload,
                value: String(payload),
            }
        case SetValue:
            return {
                ...state,
                cache: state.cache + 1,
                value: String(payload),
                sanitizedValue: (() => {
                    const n = Number.parseInt(payload, 10)

                    if (Number.isNaN(n)) {
                        return state.sanitizedValue
                    }

                    return Math.max(PARTITIONS_MIN, Math.min(PARTITIONS_MAX, n))
                })(),
            }
        default:
    }

    return state
}

function UnwrappedPartitionsSection({ disabled, canEdit }) {
    const { partitions = 1 } = useTransientStream()

    const [state, dispatch] = useReducer(reducer, reducer(undefined, {
        type: Init,
        payload: partitions,
    }))

    useEffect(() => {
        dispatch({
            type: Init,
            payload: partitions,
        })
    }, [partitions])

    const stateRef = useRef(state)

    useEffect(() => {
        stateRef.current = state
    }, [state])

    const { stage } = useStreamModifier()

    const stageRef = useRef(stage)

    useEffect(() => {
        stageRef.current = stage
    }, [stage])

    const { cache } = state

    useEffect(() => {
        if (!cache && typeof stageRef.current !== 'function') {
            return
        }

        const { current: { sanitizedValue, initializer } } = stateRef

        if (sanitizedValue !== initializer) {
            stageRef.current({
                partitions: sanitizedValue,
            })
        }
    }, [cache])

    return (
        <Fragment>
            {!!canEdit && (
                <Desc>
                    Partitioning enables high-volume streams to scale beyond what a typical node can handle.
                    {' '}
                    If you&apos;re not sure if your stream needs partitions, leave it set to 1.
                </Desc>
            )}
            <Partitions>
                <Label>Partitions</Label>
                <Numeric
                    min={PARTITIONS_MIN}
                    max={PARTITIONS_MAX}
                    value={state.value}
                    onChange={({ target }) => {
                        dispatch({
                            type: SetValue,
                            payload: target.value,
                        })
                    }}
                    onBlur={() => void dispatch({
                        type: Init,
                        payload: state.sanitizedValue,
                    })}
                    disabled={disabled}
                    name="partitions"
                />
            </Partitions>
        </Fragment>
    )
}

const Partitions = styled.div`
    max-width: 136px;
`

const Desc = styled.p`
    margin-bottom: 3.125rem;
    max-width: 660px;
`

export default function PartitionsSection({ disabled: disabledProp, ...props }) {
    const { [StreamPermission.EDIT]: canEdit = false } = useStreamPermissions()

    const disabled = disabledProp || !canEdit

    const isWithinNav = useIsWithinNav()

    return (
        <TOCPage.Section
            id="stream-partitions"
            title="Stream partitions"
            linkTitle="Partitions"
            status={<StatusLabel.Advanced />}
            disabled={disabled}
        >
            {!isWithinNav && (
                <UnwrappedPartitionsSection
                    {...props}
                    canEdit={canEdit}
                    disabled={disabled}
                />
            )}
        </TOCPage.Section>
    )
}
