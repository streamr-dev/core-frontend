import React, { useState } from 'react'
import { Label } from 'reactstrap'
import styled from 'styled-components'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Checkbox from '$shared/components/Checkbox'
import Buttons from '$shared/components/Buttons'
import { PublishMode } from '$mp/containers/ProjectEditing/publishMode'
import routes from '$routes'
import { Props } from '.'
const Footer = styled.div`
    border-top: 1px solid #f2f1f1;
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
const publishModes = {
    [PublishMode.REPUBLISH]: 'Republish',
    [PublishMode.REDEPLOY]: 'Publish',
    [PublishMode.PUBLISH]: 'Publish',
    [PublishMode.UNPUBLISH]: '',
    [PublishMode.ERROR]: '',
}

const ReadyToPublishDialog = ({ onContinue, onCancel, publishMode, disabled, nativeTokenName }: Props) => {
    const [termsAccepted, setTermsAccepted] = useState(false)
    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={`${publishModes[publishMode]} your product`}
                disabled={disabled}
                renderActions={() => (
                    <Footer>
                        <FooterText>
                            <StyledLabel check>
                                <Checkbox
                                    value={termsAccepted}
                                    onChange={(e: React.SyntheticEvent<HTMLInputElement>) =>
                                        setTermsAccepted(e.currentTarget.checked)
                                    }
                                />
                                &nbsp;
                                <span>
                                    I have the right to publish this
                                    <br />
                                    data as specified in the{' '}
                                    <a href={routes.publisherTerms()} target="_blank" rel="noopener noreferrer">
                                        Terms
                                    </a>
                                    .
                                </span>
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
                                    title: publishModes[publishMode],
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
                    Paid products require an {nativeTokenName} balance for gas fees.
                </p>
            </Dialog>
        </ModalPortal>
    )
}

export default ReadyToPublishDialog
