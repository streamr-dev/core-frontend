import React, { Fragment, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import { updateEditStream } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import Text from '$ui/Text'
import Select from '$ui/Select'
import Label from '$ui/Label'
import Storage from './Storage'

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

const StyledTranslate = styled(Translate)`
    margin-bottom: 3.125rem;
`

const StyledText = styled(Text)`
    text-align: center;
`

const InputContainer = styled.div`
    display: grid;
    grid-template-columns: 5rem 11rem;
    grid-column-gap: 1rem;
`

const HistoryView = ({ streamId, disabled }) => {
    const [storageAmount, setStorageAmount] = useState(0)
    const [storageUnit, setStorageUnit] = useState(undefined)
    const stream = useSelector(selectEditedStream)
    const streamRef = useRef(stream)
    streamRef.current = stream
    const dispatch = useDispatch()

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
        if (!!streamRef.current && storageAmount != null && storageUnit != null) {
            dispatch(updateEditStream({
                ...streamRef.current,
                storageDays: convertToStorageDays(storageAmount, storageUnit),
            }))
        }
    }, [storageAmount, storageUnit, dispatch])

    const unitOptions = useMemo(() => [
        {
            value: 'days',
            label: I18n.t('shared.date.day', { count: storageAmount }),
        },
        {
            value: 'weeks',
            label: I18n.t('shared.date.week', { count: storageAmount }),
        },
        {
            value: 'months',
            label: I18n.t('shared.date.month', { count: storageAmount }),
        },
    ], [storageAmount])

    return (
        <Root>
            <StyledTranslate
                value="userpages.streams.edit.historicalStoragePeriod.description"
                tag="p"
            />
            <Storage streamId={streamId} />
            {stream && stream.storageDays !== undefined &&
                <Fragment>
                    <Label htmlFor="storageAmount">
                        {I18n.t('userpages.streams.edit.configure.historicalStoragePeriod.label')}
                    </Label>
                    <InputContainer>
                        <StyledText
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
