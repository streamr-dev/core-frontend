// @flow

import React, { Fragment, useMemo, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { arrayMove } from 'react-sortable-hoc'
import uuid from 'uuid'
import styled from 'styled-components'
import { useClient } from 'streamr-client-react'

import Button from '$shared/components/Button'
import type { Stream } from '$shared/flowtype/stream-types'
import FieldList from '$shared/components/FieldList'
import FieldItem from '$shared/components/FieldList/FieldItem'
import Select from '$ui/Select'
import { selectFieldsAutodetectFetching, fieldTypes } from '$userpages/modules/userPageStreams/selectors'
import Text from '$ui/Text'
import SplitControl from '$userpages/components/SplitControl'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import Label from '$ui/Label'
import useIsMounted from '$shared/hooks/useIsMounted'

import NewFieldEditor from './NewFieldEditor'

type Props = {
    stream: Stream,
    disabled: boolean,
    updateStream?: Function,
}

const Buttons = styled.div`
    margin-top: 2rem;

    > * + * {
        margin-left: 1rem;
    }
`

const Description = styled.p`
    margin-bottom: 3rem;
`

const StyledFieldList = styled(FieldList)`
    z-index: 1;
`

const isValidFieldname = (value: string, previousFields: any) => (
    !(value.length === 0 || previousFields.find((field) => field.name === value))
)

const ConfigureView = ({ stream, disabled, updateStream }: Props) => {
    const typeOptions: Array<any> = useMemo(() => Object.keys(fieldTypes).map((t) => ({
        value: t,
        label: fieldTypes[t],
    })), [])
    const [isAddingField, setIsAddingField] = useState(false)
    const fieldsAutodetectFetching = useSelector(selectFieldsAutodetectFetching)
    const isMounted = useIsMounted()
    const client = useClient()

    const streamFields = useMemo(() => {
        const { config } = stream

        return (config && config.fields) || []
    }, [stream])

    const onSortEnd = useCallback(({ newIndex, oldIndex }: { newIndex: number, oldIndex: number }) => {
        if (typeof updateStream !== 'function') { return }

        const sortedFields = arrayMove(streamFields, oldIndex, newIndex)

        updateStream('config.fields', sortedFields)
    }, [streamFields, updateStream])

    const onFieldNameChange = useCallback((fieldName: string, value: string) => {
        if (typeof updateStream !== 'function') { return }

        const index = streamFields.findIndex((field) => field.name === fieldName)

        if (isValidFieldname(value, streamFields)) {
            updateStream(`config.fields[${index}].name`, value)
        }
    }, [streamFields, updateStream])

    const onFieldTypeChange = useCallback((fieldName: string, value: string) => {
        if (typeof updateStream !== 'function') { return }

        const index = streamFields.findIndex((field) => field.name === fieldName)

        updateStream(`config.fields[${index}].type`, value)
    }, [streamFields, updateStream])

    const addNewField = useCallback(() => {
        setIsAddingField(true)
    }, [])

    const confirmAddField = useCallback((name: string, type: string) => {
        if (typeof updateStream !== 'function') { return }

        const fields = [
            ...streamFields,
            {
                name,
                type,
                id: uuid(),
            },
        ]
        updateStream('config.fields', fields)

        setIsAddingField(false)
    }, [streamFields, updateStream])

    const cancelAddField = useCallback(() => {
        setIsAddingField(false)
    }, [])

    const deleteField = useCallback((name: string) => {
        if (typeof updateStream !== 'function') { return }

        const fields = streamFields.filter((field) => field.name !== name)

        updateStream('config.fields', fields)
    }, [streamFields, updateStream])

    const streamId = stream.id
    const autodetectFields = useCallback(async () => {
        if (streamId) {
            try {
                const streamObj = await client.getStream(streamId)
                await streamObj.detectFields()

                if (!isMounted()) { return }
                const newFields = streamObj.config.fields.map((f) => ({
                    ...f,
                    id: uuid(),
                }))

                if (typeof updateStream === 'function') {
                    updateStream('config.fields', newFields)
                }

                Notification.push({
                    title: 'Fields autodetected',
                    icon: NotificationIcon.CHECKMARK,
                })
            } catch (err) {
                console.warn(err)

                if (!isMounted()) { return }

                Notification.push({
                    title: err.message,
                    icon: NotificationIcon.ERROR,
                })
            }
        }
    }, [streamId, isMounted, client, updateStream])

    const isDisabled = !!(disabled || fieldsAutodetectFetching)

    return (
        <div>
            <Description>
                You can configure your stream’s fields and data types here.
                {' '}
                If there already are stored messages in the stream,
                {' '}
                you can autoconfigure the fields based on the latest message.
            </Description>
            {!!streamFields && streamFields.length > 0 && (
                <Fragment>
                    <SplitControl>
                        <Label>Field name</Label>
                        <Label>Data type</Label>
                    </SplitControl>
                    <StyledFieldList
                        onSortEnd={onSortEnd}
                        disabled={isDisabled || isAddingField}
                    >
                        {streamFields.map((field) => (
                            <FieldItem
                                key={field.id}
                                name={field.name}
                                onDelete={() => deleteField(field.name)}
                            >
                                <SplitControl>
                                    <Text
                                        value={field.name}
                                        onChange={(e) => onFieldNameChange(field.name, e.target.value)}
                                        disabled={isDisabled || isAddingField}
                                    />
                                    <Select
                                        disabled={isDisabled || isAddingField}
                                        options={typeOptions}
                                        value={typeOptions.find((t) => t.value === field.type)}
                                        onChange={(o) => onFieldTypeChange(field.name, o.value)}
                                    />
                                </SplitControl>
                            </FieldItem>
                        ))}
                    </StyledFieldList>
                </Fragment>
            )}
            {!isAddingField &&
                <Buttons>
                    <Button
                        kind="secondary"
                        onClick={addNewField}
                        disabled={isDisabled}
                    >
                        Add field
                    </Button>
                    <Button
                        kind="secondary"
                        outline
                        onClick={autodetectFields}
                        disabled={isDisabled}
                        waiting={fieldsAutodetectFetching}
                    >
                        {!fieldsAutodetectFetching && 'Autodetect fields'}
                        {!!fieldsAutodetectFetching && 'Waiting...'}
                    </Button>
                </Buttons>
            }
            {!!isAddingField &&
                <NewFieldEditor
                    previousFields={streamFields}
                    onConfirm={confirmAddField}
                    onCancel={cancelAddField}
                />
            }
        </div>
    )
}

export default ConfigureView
