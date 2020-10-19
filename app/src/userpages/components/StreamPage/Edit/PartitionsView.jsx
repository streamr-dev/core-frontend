// @flow

import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import { updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import type { Stream } from '$shared/flowtype/stream-types'
import Numeric from '$ui/Numeric'
import Label from '$ui/Label'

type Props = {
    stream: Stream,
    disabled?: boolean,
}

const MIN_PARTITIONS = 1
const MAX_PARTITIONS = 99

const Root = styled.div``

const Description = styled(Translate)`
    margin-bottom: 3.125rem;
    max-width: 660px;
`

const Partitions = styled.div`
    max-width: 136px;
`

const PartitionsLabel = styled(Label)``

export const PartitionsView = ({ stream, disabled }: Props) => {
    const dispatch = useDispatch()
    const contentChangedRef = useRef(false)
    const streamRef = useRef()
    streamRef.current = stream

    useEffect(() => {
        const handleBeforeunload = (event) => {
            if (contentChangedRef.current) {
                const message = I18n.t('userpages.streams.edit.details.unsavedChanges')
                const evt = (event || window.event)
                evt.returnValue = message // Gecko + IE
                return message // Webkit, Safari, Chrome etc.
            }
            return ''
        }

        window.addEventListener('beforeunload', handleBeforeunload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeunload)
        }
    }, [contentChangedRef])

    const editField = useCallback((field: string, data: any) => {
        dispatch(updateEditStreamField(field, data))
    }, [dispatch])

    const { partitions } = stream

    const [partitionsValue, setPartitionsValue] = useState(String(partitions))

    const onCommit = useCallback(() => {
        let numberValue = Number.parseInt(partitionsValue, 10)
        // if entered value is NaN use existing value
        numberValue = Number.isNaN(numberValue) ? partitions : numberValue
        numberValue = Math.max(MIN_PARTITIONS, Math.min(numberValue, MAX_PARTITIONS))
        setPartitionsValue(String(numberValue))
        editField('partitions', numberValue)
    }, [editField, partitions, partitionsValue])

    const onPartitionsChange = useCallback((event) => {
        setPartitionsValue(event.target.value)
    }, [setPartitionsValue])

    return (
        <Root>
            <Description
                value="userpages.streams.edit.streamPartitions.description"
                dangerousHTML
                tag="p"
            />
            <Partitions>
                <PartitionsLabel>
                    {I18n.t('userpages.streams.partitionsLabel')}
                </PartitionsLabel>
                <Numeric
                    min={MIN_PARTITIONS}
                    max={MAX_PARTITIONS}
                    value={partitionsValue}
                    onChange={onPartitionsChange}
                    onBlur={onCommit}
                    disabled={disabled}
                    name="partitions"
                />
            </Partitions>
        </Root>
    )
}

export default PartitionsView
