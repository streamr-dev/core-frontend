// @flow

import React, { useState, useCallback } from 'react'
import { I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Label from '$ui/Label'
import Text from '$ui/Text'

import styles from './identityNameDialog.pcss'

type Props = {
    onClose: () => void,
    onSave: (string) => Promise<void>,
    waiting?: boolean,
}

const IdentityNameDialog = ({ onClose, onSave, waiting }: Props) => {
    const [name, setName] = useState('')

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
                        onClick: () => onClose(),
                    },
                    save: {
                        title: I18n.t('modal.common.next'),
                        kind: 'primary',
                        onClick: () => onSave(name),
                        disabled: !name || !!waiting,
                        spinner: !!waiting,
                    },
                }}
            >
                <div className={styles.textField}>
                    <Label>
                        {I18n.t('modal.newIdentity.label')}
                    </Label>
                    <Text
                        placeholder={I18n.t('modal.newIdentity.placeholder')}
                        value={name}
                        onChange={onNameChange}
                    />
                </div>
            </Dialog>
        </ModalPortal>
    )
}

export default IdentityNameDialog
