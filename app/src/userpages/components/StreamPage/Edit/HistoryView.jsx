import React, { Fragment, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import styled from 'styled-components'

import Text from '$ui/Text'
import Select from '$ui/Select'
import Label from '$ui/Label'
import Storage from '$app/src/pages/AbstractStreamEditPage/StorageNodes/Storage'

export const convertFromStorageDays = (days) => {
    let amount = days
    let unit = 'days'

    if (days % 30 === 0) {
        amount = days / 30
        unit = 'months'
    } else if (days % 7 === 0) {
        amount = days / 7
        unit = 'weeks'
    }

    return {
        amount,
        unit,
    }
}

const convertToStorageDays = (amount, unit) => {
    if (unit === 'months') {
        return amount * 30
    } else if (unit === 'weeks') {
        return amount * 7
    }
    return amount
}

const Root = styled.div``

const Description = styled.p`
    margin-bottom: 3.125rem;
`

const InputContainer = styled.div`
    display: grid;
    grid-template-columns: 5rem 11rem;
    grid-column-gap: 1rem;
`

const HistoryView = ({
    stream,
    originalStream,
    disabled,
    updateStream,
    showStorageOptions = true,
}) => {
    const [storageAmount, setStorageAmount] = useState(0)
    const [storageUnit, setStorageUnit] = useState(undefined)
    const { id: streamId } = stream
    const streamRef = useRef(stream)
    streamRef.current = stream

    useEffect(() => {
        if (!streamId || !streamRef.current) { return }

        const { amount, unit } = convertFromStorageDays(streamRef.current.storageDays)

        setStorageAmount(amount)
        setStorageUnit(unit)
    }, [streamId])

    const onStorageAmountChange = useCallback((e) => {
        const amount = Number(e.target.value)
        setStorageAmount(amount)
    }, [])

    const onStoragePeriodUnitChange = useCallback(({ value }) => {
        setStorageUnit(value)
    }, [])

    useEffect(() => {
        if (storageAmount !== undefined && storageUnit !== undefined && typeof updateStream === 'function') {
            updateStream({
                storageDays: convertToStorageDays(storageAmount, storageUnit),
            })
        }
    }, [storageAmount, storageUnit, updateStream])

    const unitOptions = useMemo(() => [
        {
            value: 'days',
            label: `Day${storageAmount === 1 ? '' : 's'}`,
        },
        {
            value: 'weeks',
            label: `Week${storageAmount === 1 ? '' : 's'}`,
        },
        {
            value: 'months',
            label: `Month${storageAmount === 1 ? '' : 's'}`,
        },
    ], [storageAmount])

    return (
        <Root>
            <Description>
                Enable storage to retain historical data in one or more geographic locations of your choice.
                {' '}
                You can also choose how long to store your stream’s historical data before auto-deletion.
            </Description>
            {!!showStorageOptions && (
                <Storage stream={originalStream} />
            )}
            {stream &&
                <Fragment>
                    <Label htmlFor="storageAmount">
                        Store historical data for
                    </Label>
                    <InputContainer>
                        <Text
                            id="storageAmount"
                            value={storageAmount}
                            onChange={onStorageAmountChange}
                            disabled={disabled}
                            name="storageAmount"
                        />
                        <Select
                            options={unitOptions}
                            value={unitOptions.find((o) => o.value === storageUnit)}
                            onChange={onStoragePeriodUnitChange}
                            disabled={disabled}
                        />
                    </InputContainer>
                </Fragment>
            }
        </Root>
    )
}

export default HistoryView
