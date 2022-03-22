import React, { useEffect, useReducer, useMemo, useRef } from 'react'
import styled from 'styled-components'
import TOCPage from '$shared/components/TOCPage'
import Label from '$ui/Label'
import Text from '$ui/Text'
import Select from '$ui/Select'
import useStreamId from '$shared/hooks/useStreamId'
import StorageNodeList from './StorageNodeList'

const UNIT_DAY = 'day'

const UNIT_WEEK = 'week'

const UNIT_MONTH = 'month'

const initialState = {
    cache: undefined,
    quantity: undefined,
    unit: undefined,
}

const SetDaysQuantity = 'set quantity in days'

const SetQuantity = 'set quantity'

const SetUnit = 'set unit'

const Invalidate = 'invalidate'

function reducer(state, { type, value }) {
    switch (type) {
        case Invalidate:
            return {
                ...state,
                cache: (state.cache || 0) + 1,
            }
        case SetDaysQuantity:
            switch (state.unit) {
                case UNIT_WEEK:
                    if (value / 7 === state.quantity) {
                        return state
                    }
                    break
                case UNIT_MONTH:
                    if (value / 30 === state.quantity) {
                        return state
                    }
                    break
                case undefined:
                    if (value % 30 === 0) {
                        return {
                            quantity: value / 30,
                            unit: UNIT_MONTH,
                        }
                    }
                    if (value % 7 === 0) {
                        return {
                            quantity: value / 7,
                            unit: UNIT_WEEK,
                        }
                    }
                    break
                default:
            }

            return {
                quantity: value,
                unit: UNIT_DAY,
            }
        case SetQuantity:
            return {
                ...state,
                quantity: Number.isNaN(value) ? undefined : value,
            }
        case SetUnit:
            return reducer({
                ...state,
                unit: value,
            }, {
                type: Invalidate,
            })
        default:
            return state
    }
}

function pluralize(word, quantity) {
    return `${word}${quantity !== 1 ? 's' : ''}`
}

function UnstyledHistorySection({
    className,
    disabled = false,
    duration: durationProp,
    onChange,
    desc = (
        <p>
            Enable storage to retain historical data in one or more geographic locations of your choice.
            {' '}
            You can also choose how long to store your stream&apos;s historical data before auto-deletion.
        </p>
    ),
}) {
    const [{ quantity, unit, cache }, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        dispatch({
            type: SetDaysQuantity,
            value: durationProp,
        })
    }, [durationProp])

    const units = useMemo(() => [
        {
            value: 'day',
            label: pluralize('Day', quantity),
        },
        {
            value: 'week',
            label: pluralize('Week', quantity),
        },
        {
            value: 'month',
            label: pluralize('Month', quantity),
        },
    ], [quantity])

    const stateRef = useRef({
        duration: durationProp,
        onChange,
        quantity,
        unit,
    })

    useEffect(() => {
        stateRef.current = {
            duration: durationProp,
            onChange,
            quantity,
            unit,
        }
    }, [durationProp, onChange, quantity, unit])

    useEffect(() => {
        const { current: state } = stateRef

        if (typeof cache === 'undefined') {
            // Skip the on-mount pass.
            return
        }

        if (typeof state.onChange !== 'function') {
            return
        }

        const q = Number.isNaN(state.quantity / 1) ? undefined : Math.max(0, state.quantity)

        const newDuration = (() => {
            if (typeof q === 'undefined') {
                return undefined
            }

            switch (state.unit) {
                case UNIT_WEEK:
                    return q * 7
                case UNIT_MONTH:
                    return q * 30
                case UNIT_DAY:
                default:
                    return q
            }
        })()

        if (state.duration !== newDuration) {
            state.onChange(newDuration)
        }
    }, [cache])

    const streamId = useStreamId()

    return (
        <TOCPage.Section
            id="historical-data"
            title="Data storage"
        >
            <div className={className}>
                {desc}
                {!!streamId && (
                    <StorageNodeList />
                )}
                <Label htmlFor="storageAmount">
                    Store historical data for
                </Label>
                <InputContainer>
                    <Text
                        id="storageAmount"
                        value={typeof quantity === 'undefined' ? '' : quantity}
                        onChange={({ target }) => void dispatch({
                            type: SetQuantity,
                            value: Number.parseInt(target.value, 10),
                        })}
                        onBlur={() => void dispatch({
                            type: Invalidate,
                        })}
                        disabled={disabled}
                        name="storageAmount"
                    />
                    <Select
                        options={units}
                        value={units.find((o) => o.value === unit)}
                        onChange={({ value }) => void dispatch({
                            type: SetUnit,
                            value,
                        })}
                        disabled={disabled}
                    />
                </InputContainer>
            </div>
        </TOCPage.Section>
    )
}

const InputContainer = styled.div`
    display: grid;
    grid-template-columns: 5rem 11rem;
    grid-column-gap: 1rem;
`

const HistorySection = styled(UnstyledHistorySection)`
    > p {
        /* @TODO: Isn't it the same as for PartitionsSection? -> normalize. */
        margin-bottom: 3.125rem;
    }
`

export default HistorySection
