import React, { useReducer, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import getUnitSelectOptions from '$app/src/getters/getUnitSelectOptions'
import Text from '$ui/Text'
import Select from '$ui/Select'

const initialState = {
    cache: undefined,
    quantity: undefined,
    unit: undefined,
    units: [],
}

const SetNativeQuantity = 'set quantity in native unit'

const SetQuantity = 'set quantity'

const SetUnit = 'set unit'

const Invalidate = 'invalidate'

function reducer(state, { type, value, detectUnit = false }) {
    switch (type) {
        case Invalidate:
            return {
                ...state,
                cache: (state.cache || 0) + 1,
            }
        case SetNativeQuantity:
            return (() => {
                const units = [...state.units]

                const [nativeUnit, nativeMultiplier] = units.shift()

                if (nativeMultiplier !== 1) {
                    throw new Error('Native multiplier has to be 1')
                }

                if (detectUnit) {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const [unit, mx] of units) {
                        if (value % mx === 0) {
                            return {
                                ...state,
                                quantity: value / mx,
                                unit,
                            }
                        }
                    }
                } else {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const [unit, mx] of units) {
                        if (state.unit === unit && value % mx === 0) {
                            return {
                                ...state,
                                quantity: value / mx,
                                unit,
                            }
                        }
                    }
                }

                return {
                    ...state,
                    quantity: value,
                    unit: nativeUnit,
                }
            })()
        case SetQuantity:
            return {
                ...state,
                quantity: Number.isNaN(value) ? undefined : value,
            }
        case SetUnit:
            return {
                ...state,
                unit: value,
            }
        default:
            return state
    }
}

export default function UnitizedQuantity({ units: unitsProp, quantity: quantityProp, onChange, disabled }) {
    const [{ quantity, unit, cache, units }, dispatch] = useReducer(reducer, {
        ...initialState,
        units: Object.entries(unitsProp).sort(([, a], [, b]) => a - b),
    })

    const detectUnitRef = useRef(true)

    useEffect(() => {
        dispatch({
            type: SetNativeQuantity,
            value: quantityProp,
            detectUnit: detectUnitRef.current,
        })
    }, [quantityProp])

    const unitOptions = useMemo(() => (
        getUnitSelectOptions(...units.map(([u]) => u), quantity)
    ), [quantity, units])

    const stateRef = useRef({
        quantityProp,
        onChange,
        quantity,
        unit,
    })

    useEffect(() => {
        stateRef.current = {
            quantityProp,
            onChange,
            quantity,
            unit,
        }
    }, [quantityProp, onChange, quantity, unit])

    const unitsRef = useRef(units)

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

        const newQuantity = (() => {
            if (typeof q === 'undefined') {
                return undefined
            }

            const [, mx] = unitsRef.current.find(([u]) => u === state.unit)

            return q * mx
        })()

        detectUnitRef.current = false

        state.onChange(newQuantity)
    }, [cache])

    return (
        <InputContainer>
            <Text
                id="storageAmount"
                value={typeof quantity === 'undefined' ? '' : quantity}
                onChange={({ target }) => {
                    dispatch({
                        type: SetQuantity,
                        value: Number.parseInt(target.value, 10),
                    })

                    dispatch({
                        type: Invalidate,
                    })
                }}
                disabled={disabled}
                name="storageAmount"
            />
            <Select
                options={unitOptions}
                value={unitOptions.find((o) => o.value === unit)}
                onChange={({ value }) => {
                    dispatch({
                        type: SetUnit,
                        value,
                    })

                    dispatch({
                        type: Invalidate,
                    })
                }}
                disabled={disabled}
            />
        </InputContainer>
    )
}

const InputContainer = styled.div`
    display: grid;
    grid-template-columns: 5rem 11rem;
    grid-column-gap: 1rem;
`
