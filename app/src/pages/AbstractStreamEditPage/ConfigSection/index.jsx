import React, { Fragment, useState, useCallback, useReducer, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Button from '$shared/components/Button'
import FieldList from '$shared/components/FieldList'
import FieldItem from '$shared/components/FieldList/FieldItem'
import Select from '$ui/Select'
import Text from '$ui/Text'
import SplitControl from '$userpages/components/SplitControl'
import TOCPage from '$shared/components/TOCPage'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import Label from '$ui/Label'
import ValidationError from '$shared/errors/ValidationError'
import InterruptionError from '$shared/errors/InterruptionError'
import useInterrupt from '$shared/hooks/useInterrupt'
import useStreamId from '$shared/hooks/useStreamId'
import useStream from '$shared/hooks/useStream'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import NewFieldEditor, { types } from './NewFieldEditor'
import reducer, { Init, AddField, RearrangeFields, SetFieldName, SetFieldType, DeleteField, Invalidate } from './reducer'

const fallbackConfig = {
    fields: [],
}

const ConfigSection = ({ disabled }) => {
    const stream = useStream()

    const { config: configProp = fallbackConfig } = stream || {}

    const [{ cache, config }, dispatch] = useReducer(reducer, reducer(undefined, {
        type: Init,
        payload: stream.config,
    }))

    useEffect(() => {
        dispatch({
            type: Init,
            payload: configProp,
        })
    }, [configProp])

    const [showAddField, setShowAddField] = useState(false)

    const [isDetectingFields, setIsDetectingFields] = useState(false)

    const itp = useInterrupt()

    const streamId = useStreamId()

    const configRef = useRef(config)

    useEffect(() => {
        configRef.current = config
    }, [config])

    const { stage } = useStreamModifier()

    const stageRef = useRef(stage)

    useEffect(() => {
        stageRef.current = stage
    }, [stage])

    useEffect(() => {
        if (!cache) {
            // Skip negative cache (initial pass).
            return
        }

        if (typeof stageRef.current === 'function') {
            stageRef.current({
                config: configRef.current,
            })
        }
    }, [cache])

    const streamRef = useRef(stream)

    useEffect(() => {
        streamRef.current = stream
    }, [stream])

    async function onDetectFieldsClick() {
        const { requireUninterrupted } = itp('detect fields')

        if ('detectFields' in streamRef.current === false) {
            return
        }

        setIsDetectingFields(true)

        try {
            try {
                await streamRef.current.detectFields()

                requireUninterrupted()

                dispatch({
                    type: Init,
                    payload: stream.config,
                })

                dispatch({
                    type: Invalidate,
                })

                Notification.push({
                    title: 'Fields autodetected',
                    icon: NotificationIcon.CHECKMARK,
                })
            } catch (e) {
                // Noop.
            }

            requireUninterrupted()

            setIsDetectingFields(false)
        } catch (e) {
            if (e instanceof InterruptionError) {
                return
            }

            Notification.push({
                title: 'Failed to detect fields',
                icon: NotificationIcon.ERROR,
            })
        }
    }

    useEffect(() => () => {
        itp().interruptAll()
    }, [itp, streamId])

    const canModifyItems = !disabled && !showAddField

    const onFieldDelete = useCallback((fieldName) => {
        dispatch({
            type: DeleteField,
            payload: fieldName,
        })

        dispatch({
            type: Invalidate,
        })
    }, [])

    const canDetectFields = 'detectFields' in stream && !disabled

    return (
        <TOCPage.Section
            disabled={disabled}
            id="configure"
            title="Fields"
        >
            <Description>
                You can configure your stream&apos;s fields and data types here.
                {' '}
                If there already are stored messages in the stream,
                {' '}
                you can autoconfigure the fields based on the latest message.
            </Description>
            {!!config.fields.length && (
                <Fragment>
                    <SplitControl>
                        <Label>Field name</Label>
                        <Label>Data type</Label>
                    </SplitControl>
                    <StyledFieldList
                        onSortEnd={({ oldIndex, newIndex }) => {
                            dispatch({
                                type: RearrangeFields,
                                payload: [oldIndex, newIndex],
                            })

                            dispatch({
                                type: Invalidate,
                            })
                        }}
                        disabled={!canModifyItems}
                    >
                        {config.fields.map((field) => (
                            <FieldItem
                                key={field.id}
                                name={field.name}
                                onDelete={onFieldDelete}
                            >
                                <SplitControl>
                                    <Text
                                        disabled={!canModifyItems}
                                        onChange={(e) => {
                                            dispatch({
                                                type: SetFieldName,
                                                payload: [field.name, e.target.value],
                                            })

                                            dispatch({
                                                type: Invalidate,
                                            })
                                        }}
                                        value={field.name}
                                    />
                                    <Select
                                        disabled={!canModifyItems}
                                        onChange={({ value }) => {
                                            dispatch({
                                                type: SetFieldType,
                                                payload: [field.name, value],
                                            })

                                            dispatch({
                                                type: Invalidate,
                                            })
                                        }}
                                        options={types}
                                        value={types.find(({ value }) => value === field.type)}
                                    />
                                </SplitControl>
                            </FieldItem>
                        ))}
                    </StyledFieldList>
                </Fragment>
            )}
            {showAddField ? (
                <NewFieldEditor
                    disabled={disabled}
                    onStage={(payload) => {
                        dispatch({
                            type: AddField,
                            payload,
                        })

                        dispatch({
                            type: Invalidate,
                        })

                        setShowAddField(false)
                    }}
                    onDiscard={() => void setShowAddField(false)}
                    onValidate={({ name }) => {
                        if (!name) {
                            throw new ValidationError('Name cannot be empty')
                        }

                        const { fields = [] } = config || {}

                        if (fields.find((f) => f.name === name)) {
                            throw new ValidationError('Name cannot be duplicate')
                        }
                    }}
                />
            ) : (
                <Buttons>
                    <Button
                        disabled={disabled}
                        kind="secondary"
                        onClick={() => void setShowAddField(true)}
                        type="button"
                    >
                        Add field
                    </Button>
                    <Button
                        disabled={!canDetectFields}
                        kind="secondary"
                        onClick={() => void onDetectFieldsClick()}
                        outline
                        type="button"
                        waiting={isDetectingFields}
                    >
                        {isDetectingFields ? 'Detecting…' : 'Detect fields'}
                    </Button>
                </Buttons>
            )}
        </TOCPage.Section>
    )
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

export default ConfigSection
