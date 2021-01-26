// @flow

import React, { useCallback, useState } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Checkbox from '$shared/components/Checkbox'
import useCopy from '$shared/hooks/useCopy'

type Props = {
    onClose: () => void,
    privateKey: string,
}

const Description = styled(Translate)`
    strong {
        font-weight: var(--medium);
    }
`

const Label = styled.label`
    background-color: #F8F8F8;
    padding: 1.75rem 1.5rem;
    margin: 0;
    margin-top: 2rem;
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    color: #525252;
    font-size: 0.875rem;
    letter-spacing: 0;
    line-height: 1rem;
`

const StyledCheckbox = styled(Checkbox)`
    margin-right: 1rem !important;
`

const CopyPrivateKeyDialog = ({ onClose: onCloseProp, privateKey }: Props) => {
    const { copy, isCopied } = useCopy()
    const [copiedOnce, setCopiedOnce] = useState(false)
    const [securelyStored, setSecurelyStored] = useState(false)

    const onKeyCopy = useCallback(() => {
        setCopiedOnce(true)
        copy(privateKey.slice(2))
    }, [copy, privateKey])

    const onClose = useCallback(() => {
        if (securelyStored && copiedOnce) {
            onCloseProp()
        }
    }, [onCloseProp, securelyStored, copiedOnce])

    const onSecurelyStoredToggle = useCallback(() => {
        setSecurelyStored((stored) => !stored)
    }, [])

    return (
        <ModalPortal>
            <Dialog
                title={I18n.t('modal.copyPrivateKey.defaultTitle')}
                onClose={onClose}
                actions={{
                    close: {
                        title: I18n.t('modal.common.close'),
                        kind: 'primary',
                        outline: true,
                        onClick: () => onClose(),
                        disabled: !securelyStored || !copiedOnce,
                    },
                    copy: {
                        title: I18n.t(`modal.copyPrivateKey.${isCopied ? 'keyCopied' : 'copyKey'}`),
                        kind: 'primary',
                        onClick: () => onKeyCopy(),
                        disabled: !securelyStored,
                    },
                }}
            >
                <Description
                    value={`modal.copyPrivateKey.${copiedOnce ? 'descriptionAfterKeyCopiedOnce' : 'defaultDescription'}`}
                    dangerousHTML
                    tag="p"
                />
                <Label>
                    <StyledCheckbox value={securelyStored} onChange={onSecurelyStoredToggle} />
                    <Translate
                        value="modal.copyPrivateKey.checkboxLabel"
                        tag="div"
                    />
                </Label>
            </Dialog>
        </ModalPortal>
    )
}

export default CopyPrivateKeyDialog
