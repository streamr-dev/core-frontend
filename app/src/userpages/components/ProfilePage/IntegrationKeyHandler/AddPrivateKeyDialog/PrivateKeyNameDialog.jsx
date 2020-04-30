// @flow

import React, { useState, useCallback, useRef } from 'react'
import { I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import { type UseStateTuple } from '$shared/flowtype/common-types'
import Label from '$ui/Label'
import Text from '$ui/Text'

import styles from './privateKeyNameDialog.pcss'

type Props = {
    onClose: () => void,
    onSave: (string) => void | Promise<void>,
    waiting?: boolean,
}

const PrivateKeyNameDialog = ({ onClose, onSave: onSaveProp, waiting }: Props) => {
    const [name, setName]: UseStateTuple<string> = useState('')
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
                title={I18n.t('modal.privateKey.defaultTitle')}
                onClose={onClose}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        kind: 'link',
                        outline: true,
                        onClick: () => onClose(),
                    },
                    save: {
                        title: I18n.t('modal.common.next'),
                        kind: 'primary',
                        onClick: onSave,
                        disabled: !name,
                    },
                }}
                waiting={waiting}
            >
                <div className={styles.textField}>
                    <Label>
                        {I18n.t('modal.privateKey.label')}
                    </Label>
                    <Text
                        placeholder={I18n.t('modal.privateKey.placeholder')}
                        value={name}
                        onChange={onNameChange}
                    />
                </div>
            </Dialog>
        </ModalPortal>
    )
}

export default PrivateKeyNameDialog
