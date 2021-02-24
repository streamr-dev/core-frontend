// @flow

import React from 'react'

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
    const subject = encodeURIComponent(`Streamr Marketplace access request for ${productName}`)
    const body = encodeURIComponent(`Hi,

I'd like to request access to your data product, ${productName}.
My ethereum address is as follows:
`)

    return (
        <ModalPortal>
            <Dialog
                title="Enquire about product access"
                onClose={onClose}
                actions={{
                    cancel: {
                        title: 'Cancel',
                        onClick: () => onClose(),
                        kind: 'link',
                    },
                    send: {
                        title: 'Send email',
                        kind: 'primary',
                        href: `mailto:${address}?subject=${subject}&body=${body}`,
                    },
                }}
            >
                <img
                    src={MailPng}
                    srcSet={`${MailPng2x} 2x`}
                    alt="Mailbox"
                />
                <span>
                    The seller has restricted access to this product.
                    <br />
                    Please click below to contact them via email.
                </span>
            </Dialog>
        </ModalPortal>
    )
}

export default WhitelistRequestAccessDialog
