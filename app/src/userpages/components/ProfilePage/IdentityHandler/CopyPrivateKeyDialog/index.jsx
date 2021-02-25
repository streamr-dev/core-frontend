// @flow

import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Checkbox from '$shared/components/Checkbox'
import useCopy from '$shared/hooks/useCopy'

type Props = {
    onClose: () => void,
    privateKey: string,
}

const Description = styled.p`
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
                title="Your private key"
                onClose={onClose}
                actions={{
                    close: {
                        title: 'Close',
                        kind: 'primary',
                        outline: true,
                        onClick: () => onClose(),
                        disabled: !securelyStored || !copiedOnce,
                    },
                    copy: {
                        title: isCopied ? 'Copied!' : 'Copy key',
                        kind: 'primary',
                        onClick: () => onKeyCopy(),
                        disabled: !securelyStored,
                    },
                }}
            >
                {!copiedOnce && (
                    <Description>
                        Your private key will be <strong>given to you once only</strong>,
                        <br />
                        so ensure that you copy and store it securely.
                    </Description>
                )}
                {!!copiedOnce && (
                    <Description>
                        Be careful with your private key, as
                        {' '}
                        <strong>
                            anyone with your key
                            <br />
                            controls your tokens
                        </strong>. Please check the box to continue.
                    </Description>
                )}
                <Label>
                    <StyledCheckbox value={securelyStored} onChange={onSecurelyStoredToggle} />
                    <div>
                        I will securely store my private key
                    </div>
                </Label>
            </Dialog>
        </ModalPortal>
    )
}

export default CopyPrivateKeyDialog
