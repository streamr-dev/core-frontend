// @flow

import React, { useMemo, useReducer, useState, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import Select from '$ui/Select'
import Text from '$ui/Text'
import type { StreamField } from '$shared/flowtype/stream-types'
import SplitControl from '$userpages/components/SplitControl'
import Label from '$ui/Label'
import Errors from '$ui/Errors'
import { fieldTypes } from '$userpages/utils/constants'

type Props = {
    previousFields: Array<StreamField>,
    onConfirm: (name: string, type: string) => void,
    onCancel: () => void,
}

type Field = {
    name: string,
    type: string,
    touched: boolean,
}
type ChangeSet = {
    name?: string,
    type?: string,
    touched?: boolean,
}

const Container = styled.div`
    box-sizing: content-box;
    border-radius: 4px;
    left: -2rem;
    margin-top: 2rem;
    padding: 2rem;
    position: relative;
    width: 100%;
    background: #F5F5F5;
`

const Buttons = styled.div`
    margin-top: 2rem;

    > * + * {
        margin-left: 1rem;
    }
`

const NewFieldEditor = ({ previousFields, onConfirm: onConfirmProp, onCancel: onCancelProp }: Props) => {
    const typeOptions: Array<any> = useMemo(() => Object.keys(fieldTypes).map((t) => ({
        value: t,
        label: fieldTypes[t],
    })), [])
    const [field, updateField] = useReducer((prevField: Field, changeSet: ChangeSet) => ({
        ...prevField,
        ...changeSet,
    }), {
        name: '',
        type: Object.keys(fieldTypes)[0],
        touched: false,
    })
    const fieldRef = useRef(field)
    fieldRef.current = field

    const [error, setError] = useState(undefined)

    const onNameChange = useCallback((value: string) => {
        updateField({
            name: value,
            touched: true,
        })
    }, [])

    const onTypeChange = useCallback((option: any) => {
        updateField({
            type: option.value,
        })
    }, [])

    const { name, touched } = field
    useEffect(() => {
        if (!touched) { return }

        let error = null

        if (name.length === 0) {
            error = 'Name cannot be empty'
        }
        if (previousFields.find((field) => field.name === name)) {
            error = 'Name cannot be duplicate'
        }

        setError(error)
    }, [name, touched, previousFields])

    const onConfirm = useCallback(() => {
        const { name, type } = fieldRef.current

        onConfirmProp(name, type)
    }, [onConfirmProp])

    const handleKeyPress = useCallback((key: string) => {
        if (key === 'Enter') {
            onConfirm()
        }
    }, [onConfirm])

    return (
        <Container>
            <SplitControl>
                <div>
                    <Label
                        htmlFor="newFieldName"
                        state={error && 'ERROR'}
                    >
                        Enter a field name
                    </Label>
                    <Text
                        id="newFieldName"
                        type="text"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        autoFocus
                        onKeyPress={(e) => handleKeyPress(e.key)}
                    />
                    <Errors overlap>
                        {error}
                    </Errors>
                </div>
                <div>
                    <Label htmlFor="newFieldType">
                        Data type
                    </Label>
                    <Select
                        id="newFieldType"
                        name="type"
                        options={typeOptions}
                        value={typeOptions.find((t) => t.value === field.type)}
                        onChange={onTypeChange}
                    />
                </div>
            </SplitControl>
            <Buttons>
                <Button
                    kind="secondary"
                    disabled={error !== null}
                    onClick={onConfirm}
                >
                    Add
                </Button>
                <Button
                    kind="link"
                    onClick={onCancelProp}
                >
                    Cancel
                </Button>
            </Buttons>
        </Container>
    )
}

export default NewFieldEditor
