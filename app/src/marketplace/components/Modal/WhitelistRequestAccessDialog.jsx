// @flow

import React from 'react'

import { Translate, I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import ModalPortal from '$shared/components/ModalPortal'
import MailPng from '$mp/assets/mail.png'
import MailPng2x from '$mp/assets/mail@2x.png'

export type RequestAccessModalProps = {
    onClose: () => void,
    contactEmail: string,
    productName: string,
}

const WhitelistRequestAccessDialog = ({ onClose, contactEmail, productName }: RequestAccessModalProps) => {
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
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        onClick: () => onClose(),
                        kind: 'link',
                    },
                    send: {
                        title: I18n.t('modal.whitelistRequestAccess.sendEmail'),
                        kind: 'primary',
                        href: `mailto:${address}?subject=${subject}&body=${body}`,
                    },
                }}
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

export default WhitelistRequestAccessDialog
