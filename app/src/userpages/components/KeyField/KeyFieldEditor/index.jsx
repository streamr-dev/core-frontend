// @flow

import React, { useState, useCallback } from 'react'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import UnstyledButtons from '$shared/components/Buttons'
import Label from '$ui/Label'
import Text from '$ui/Text'
import Errors from '$ui/Errors'

export type LabelType = 'apiKey' | 'address' | 'sharedSecret'

const KeyName = styled.div``

const KeyValue = styled.div``

const Buttons = styled(UnstyledButtons)``

type Props = {
    keyName?: string,
    value?: string,
    createNew?: boolean,
    showValue?: boolean,
    onCancel: () => void,
    onSave: (keyName: string) => void | Promise<void>,
    waiting?: boolean,
    error?: ?string,
    labelType: LabelType,
}

const UnstyledKeyFieldEditor = ({
    onCancel,
    onSave,
    createNew,
    keyName: keyNameProp,
    value,
    showValue,
    waiting,
    error,
    labelType,
    ...props
}: Props) => {
    const [keyName, setKeyName] = useState(keyNameProp || '')

    const onKeyNameChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        setKeyName(e.target.value)
    }, [])

    const filled = !!keyName && (createNew || !!value)

    return (
        <div {...props}>
            <KeyName>
                <Label
                    htmlFor="keyName"
                    state={createNew && !showValue && error && 'ERROR'}
                >
                    {I18n.t(`userpages.keyFieldEditor.keyName.${labelType}`)}
                </Label>
                <Text
                    id="keyName"
                    value={keyName}
                    onChange={onKeyNameChange}
                />
                {createNew && !showValue && error && (
                    <Errors overlap>
                        {error}
                    </Errors>
                )}
            </KeyName>
            {(!createNew || showValue) && (
                <KeyValue>
                    <Label
                        htmlFor="keyValue"
                        state={error && 'ERROR'}
                    >
                        {I18n.t(`userpages.keyFieldEditor.keyValue.${labelType}`)}
                    </Label>
                    <Text
                        id="keyValue"
                        value={value}
                        readOnly
                    />
                    <Errors overlap>
                        {error}
                    </Errors>
                </KeyValue>
            )}
            <Buttons
                actions={{
                    save: {
                        title: I18n.t(`userpages.keyFieldEditor.${createNew ? 'add' : 'save'}`),
                        kind: 'secondary',
                        onClick: () => onSave(keyName),
                        disabled: !filled || waiting,
                        spinner: waiting,
                    },
                    cancel: {
                        kind: 'link',
                        className: 'grey-container',
                        title: I18n.t('userpages.keyFieldEditor.cancel'),
                        outline: true,
                        onClick: () => onCancel(),
                    },
                }}
            />
        </div>
    )
}

UnstyledKeyFieldEditor.defaultProps = {
    labelType: 'apiKey',
}

const KeyFieldEditor = styled(UnstyledKeyFieldEditor)`
    position: relative;
    background: #F5F5F5;
    border-radius: 4px;
    margin: -1rem -2rem 0 -2rem;
    padding: 2rem;

    ${Buttons} {
        justify-content: flex-start;
        padding: 0;
        margin-top: 1.875rem;
    }

    ${KeyValue} {
        margin-top: 1.7rem;
    }
`

export default KeyFieldEditor
