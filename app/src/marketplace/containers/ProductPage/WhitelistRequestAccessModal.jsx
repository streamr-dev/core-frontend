// @flow

import React from 'react'
import styled from 'styled-components'

import { Translate, I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import ModalPortal from '$shared/components/ModalPortal'
import Buttons from '$shared/components/Buttons'
import MailPng from '$mp/assets/mail.png'
import MailPng2x from '$mp/assets/mail@2x.png'
import useModal from '$shared/hooks/useModal'

const Footer = styled.div`
    padding: 1.5rem;
    display: flex;
    align-self: flex-end;
`

export type RequestAccessModalProps = {
    onClose: () => void,
    contactEmail: string,
    productName: string,
}

const WhitelistRequestAccessModalComponent = ({ onClose, contactEmail, productName }: RequestAccessModalProps) => {
    const address = encodeURIComponent(contactEmail)
    const subject = encodeURIComponent(I18n.t('modal.whitelistRequestAccess.mailtoSubject', {
        productName,
    }))
    const body = encodeURIComponent(I18n.t('modal.whitelistRequestAccess.mailtoBody', {
        productName,
    }))

    return (
        <ModalPortal>
            <Dialog
                title={I18n.t('modal.whitelistRequestAccess.title')}
                onClose={onClose}
                renderActions={() => (
                    <Footer>
                        <Buttons
                            actions={{
                                cancel: {
                                    title: I18n.t('modal.common.cancel'),
                                    onClick: onClose,
                                    kind: 'link',
                                },
                                send: {
                                    title: I18n.t('modal.whitelistRequestAccess.sendEmail'),
                                    kind: 'primary',
                                    href: `mailto:${address}?subject=${subject}&body=${body}`,
                                },
                            }}
                        />
                    </Footer>
                )}
            >
                <img
                    src={MailPng}
                    srcSet={`${MailPng2x} 2x`}
                    alt={I18n.t('modal.whitelistRequestAccess.imageAlt')}
                />
                <Translate value="modal.whitelistRequestAccess.message" dangerousHTML />
            </Dialog>
        </ModalPortal>
    )
}

export const WhitelistRequestAccessModal = () => {
    const { api, isOpen, value } = useModal('requestWhitelistAccess')

    if (!isOpen) {
        return null
    }

    const { contactEmail, productName } = value || {}

    return (
        <WhitelistRequestAccessModalComponent
            contactEmail={contactEmail}
            onClose={() => api.close({
                save: false,
                redirect: false,
            })}
            productName={productName}
        />
    )
}

export default WhitelistRequestAccessModal
