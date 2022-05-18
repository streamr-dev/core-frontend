import React, { useReducer, useState, useEffect, useRef } from 'react'
import uuid from 'uuid'
import styled from 'styled-components'
import Button from '$shared/components/Button'
import Select from '$ui/Select'
import Text from '$ui/Text'
import SplitControl from '$userpages/components/SplitControl'
import Label from '$ui/Label'
import Errors from '$ui/Errors'
import { fieldTypes } from '$userpages/utils/constants'
import ValidationError from '$shared/errors/ValidationError'

export const types = Object.keys(fieldTypes).map((t) => ({
    value: t,
    label: fieldTypes[t],
}))

const Init = 'init'

const SetType = 'set type'

const SetName = 'set name'

function reducer(state, { type, payload }) {
    switch (type) {
        case Init:
            return {
                id: uuid(),
                name: '',
                type: types[0].value,
            }
        case SetType:
            return {
                ...state,
                type: payload,
            }
        case SetName:
            return {
                ...state,
                name: payload,
            }
        default:
    }

    return state
}

const NewFieldEditor = ({ onStage, onDiscard, onValidate, disabled }) => {
    const [field, dispatch] = useReducer(reducer, reducer(undefined, {
        type: Init,
    }))

    const [validationError, setValidationError] = useState()

    const onValidateRef = useRef(onValidate)

    useEffect(() => {
        onValidateRef.current = onValidate
    }, [onValidate])

    const firstRunRef = useRef(true)

    function stage() {
        try {
            if (typeof onValidateRef.current === 'function') {
                onValidateRef.current(field)
            }

            onStage(field)
        } catch (e) {
            if (e instanceof ValidationError) {
                setValidationError(e.message)
            }
        }
    }

    useEffect(() => {
        if (firstRunRef.current) {
            firstRunRef.current = false
            return
        }

        if (typeof onValidateRef.current !== 'function') {
            return
        }

        setValidationError(undefined)

        try {
            onValidateRef.current(field)
        } catch (e) {
            if (e instanceof ValidationError) {
                setValidationError(e.message)
            }
        }
    }, [field])

    function onKeyPress(e) {
        if (e.key === 'Enter') {
            stage()
            e.preventDefault()
        }
    }

    const canStage = !!field.name && !validationError && !disabled

    return (
        <Container>
            <SplitControl>
                <div>
                    <Label
                        htmlFor="newFieldName"
                        state={validationError && 'ERROR'}
                    >
                        Enter a field name
                    </Label>
                    <Text
                        id="newFieldName"
                        type="text"
                        value={field.name}
                        onChange={(e) => void dispatch({
                            type: SetName,
                            payload: e.target.value,
                        })}
                        autoFocus
                        onKeyPress={onKeyPress /* eslint-disable-line react/jsx-no-bind */}
                        disabled={disabled}
                    />
                    <Errors overlap>
                        {validationError}
                    </Errors>
                </div>
                <div>
                    <Label htmlFor="newFieldType">
                        Data type
                    </Label>
                    <Select
                        id="newFieldType"
                        name="type"
                        options={types}
                        value={types.find((t) => t.value === field.type)}
                        onChange={({ value: payload }) => void dispatch({
                            type: SetType,
                            payload,
                        })}
                        disabled={disabled}
                    />
                </div>
            </SplitControl>
            <Buttons>
                <Button
                    type="button"
                    kind="secondary"
                    disabled={!canStage}
                    onClick={() => void stage()}
                >
                    Add
                </Button>
                <Button
                    type="button"
                    kind="link"
                    onClick={() => void onDiscard()}
                    disabled={disabled}
                >
                    Cancel
                </Button>
            </Buttons>
        </Container>
    )
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

export default NewFieldEditor
