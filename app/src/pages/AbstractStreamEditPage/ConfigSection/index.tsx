import React, { Fragment, useState, useCallback, useReducer, useEffect, useRef } from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import Button from '$shared/components/Button'
import FieldList from '$shared/components/FieldList'
import FieldItem from '$shared/components/FieldList/FieldItem'
import Select from '$ui/Select'
import Text from '$ui/Text'
import SplitControl from '$userpages/components/SplitControl'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import Label from '$ui/Label'
import ValidationError from '$shared/errors/ValidationError'
import InterruptionError from '$shared/errors/InterruptionError'
import useInterrupt from '$shared/hooks/useInterrupt'
import useStreamId from '$shared/hooks/useStreamId'
import useStream from '$shared/hooks/useStream'
import { useTransientStream } from '$shared/contexts/TransientStreamContext'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import { useCurrentAbility } from '$shared/stores/abilities'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import NewFieldEditor, { types } from './NewFieldEditor'
import reducer, {
    Init,
    AddField,
    RearrangeFields,
    SetFieldName,
    SetFieldType,
    DeleteField,
    Invalidate,
} from './reducer'

const fallbackConfig = {
    fields: [],
}

const UnwrappedConfigSection = ({ disabled, canEdit }) => {
    const { metadata } = useTransientStream()
    const { config: configProp = fallbackConfig } = metadata || {}

    const stream = useStream()
    const [{ cache, config }, dispatch] = useReducer(
        reducer,
        reducer(undefined, {
            type: Init,
            payload: configProp,
        }),
    )
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
            // Skip 0-cache (initial pass).
            return
        }

        if (typeof stageRef.current === 'function') {
            stageRef.current({
                metadata: {
                    config: configRef.current,
                },
            })
        }
    }, [cache])

    async function onDetectFieldsClick() {
        const { requireUninterrupted } = itp('detect fields')

        if (!stream || 'detectFields' in stream === false) {
            return
        }

        setIsDetectingFields(true)

        try {
            try {
                await stream.detectFields()
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

    useEffect(
        () => () => {
            itp().interruptAll()
        },
        [itp, streamId],
    )
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
    const canDetectFields = stream && 'detectFields' in stream && !disabled
    return (
        <Fragment>
            {!!canEdit && (
                <Description>
                    You can configure your stream&apos;s fields and data types here. If there already are stored
                    messages in the stream, you can autoconfigure the fields based on the latest message.
                </Description>
            )}
            {!config.fields.length && !canEdit && <p>Stream has no predefined fields.</p>}
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
                            <FieldItem key={field.id} name={field.name} onDelete={onFieldDelete}>
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
            {!!canEdit && !!showAddField && (
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
            )}
            {!!canEdit && !showAddField && (
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
        </Fragment>
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
export default function ConfigSection({ disabled: disabledProp, ...props }) {
    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const isWithinNav = useIsWithinNav()

    return (
        <TOCSection disabled={disabled} id="configure" title="Fields">
            {!isWithinNav && <UnwrappedConfigSection {...props} disabled={disabled} canEdit={canEdit} />}
        </TOCSection>
    )
}
