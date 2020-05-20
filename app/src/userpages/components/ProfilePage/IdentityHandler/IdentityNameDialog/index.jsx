// @flow

import React, { useState, useCallback, useRef } from 'react'
import { I18n } from 'react-redux-i18n'

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
                title={I18n.t('modal.newIdentity.defaultTitle')}
                onClose={onClose}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        kind: 'link',
                        outline: true,
                        onClick: () => onCancel(),
                    },
                    save: {
                        title: I18n.t('modal.common.next'),
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
                        {I18n.t('modal.newIdentity.label')}
                    </Label>
                    <Text
                        placeholder={I18n.t('modal.newIdentity.placeholder')}
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
