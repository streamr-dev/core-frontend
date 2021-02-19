// @flow

import React, { useState } from 'react'
import { I18n } from 'react-redux-i18n'
import { Label } from 'reactstrap'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Checkbox from '$shared/components/Checkbox'
import Buttons from '$shared/components/Buttons'
import routes from '$routes'

import type { Props } from '.'

const Footer = styled.div`
    border-top: 1px solid #F2F1F1;
    padding: 1.5rem;
    display: flex;
    align-items: center;
`

const FooterText = styled.div`
    flex: 1;
    text-align: left;
    color: #525252;
    font-family: var(--sans);
    font-size: 0.875rem;
    letter-spacing: 0;
    line-height: 1rem;
`

const StyledLabel = styled(Label)`
    font-size: 12px;
    display: flex;
    align-items: center;

    input {
        margin-right: 1rem;
    }

    a,
    a:hover,
    a:active,
    a:visited {
        color: inherit;
        text-decoration: underline;
    }
`

const ReadyToPublishDialog = ({ onContinue, onCancel, publishMode, disabled }: Props) => {
    const [termsAccepted, setTermsAccepted] = useState(false)

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={I18n.t(`modal.readyToPublish.${publishMode}.title`)}
                disabled={disabled}
                renderActions={() => (
                    <Footer>
                        <FooterText>
                            <StyledLabel check>
                                <Checkbox
                                    value={termsAccepted}
                                    onChange={(e: SyntheticInputEvent<HTMLInputElement>) => setTermsAccepted(e.currentTarget.checked)}
                                />
                                &nbsp;
                                I have the right to publish this<br />
                                data as specified in the <a href={routes.publisherTerms()} target="_blank" rel="noopener noreferrer">Terms</a>.
                            </StyledLabel>
                        </FooterText>
                        <Buttons
                            actions={{
                                cancel: {
                                    title: 'Cancel',
                                    onClick: () => onCancel(),
                                    kind: 'link',
                                },
                                publish: {
                                    title: I18n.t(`modal.readyToPublish.${publishMode}.action`),
                                    kind: 'primary',
                                    onClick: () => onContinue(),
                                    disabled: !termsAccepted,
                                },
                            }}
                        />
                    </Footer>
                )}
            >
                <p>
                    You&apos;re about to publish to the Marketplace.
                    <br />
                    Paid products require an Eth balance for gas fees.
                </p>
            </Dialog>
        </ModalPortal>
    )
}

export default ReadyToPublishDialog
