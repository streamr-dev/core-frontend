// @flow

import React, { useState, useCallback, useRef } from 'react'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Label from '$ui/Label'
import Text from '$ui/Text'

import styles from './identityNameDialog.pcss'

type Props = {
    onClose: () => void,
    onCancel: () => void,
    onSave: (string) => Promise<void>,
    waiting?: boolean,
    initialValue?: string,
    disabled?: boolean,
}

const IdentityNameDialog = ({
    onClose,
    onCancel,
    onSave: onSaveProp,
    waiting,
    initialValue,
    disabled,
}: Props) => {
    const [name, setName] = useState(initialValue || '')
    const nameRef = useRef()
    nameRef.current = name

    const onSave = useCallback(() => {
        onSaveProp(nameRef.current || '')
    }, [onSaveProp, nameRef])

    const onNameChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        setName(e.target.value)
    }, [])

    return (
        <ModalPortal>
            <Dialog
                title="Add a name to this Ethereum account"
                onClose={onClose}
                actions={{
                    cancel: {
                        title: 'Cancel',
                        kind: 'link',
                        outline: true,
                        onClick: () => onCancel(),
                    },
                    save: {
                        title: 'Next',
                        kind: 'primary',
                        onClick: () => onSave(),
                        disabled: !name || !!waiting,
                        spinner: !!waiting,
                    },
                }}
                disabled={disabled}
            >
                <div className={styles.textField}>
                    <Label>
                        Account name
                    </Label>
                    <Text
                        placeholder="eg. Main Eth Address"
                        value={name}
                        onChange={onNameChange}
                        disabled={!!waiting}
                    />
                </div>
            </Dialog>
        </ModalPortal>
    )
}

IdentityNameDialog.defaultProps = {
    initialValue: '',
}

export default IdentityNameDialog
