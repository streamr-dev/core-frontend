// @flow

import React, { useState } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import Text from '$ui/Text'
import Label from '$ui/Label'
import Dialog from '$shared/components/Dialog'
import ModalPortal from '$shared/components/ModalPortal'
import Buttons from '$shared/components/Buttons'
import useModal from '$shared/hooks/useModal'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'
import { isEthereumAddress } from '$mp/utils/validate'
import MailPng from '$mp/assets/mail.png'
import MailPng2x from '$mp/assets/mail@2x.png'
import useWhitelist from './useWhitelist'

const Footer = styled.div`
    padding: 1.5rem;
    display: flex;
    align-self: flex-end;
`

const StyledLabel = styled(Label)`
    align-self: start;
`

export type AddModalProps = {
    onClose: () => void,
    onSave: (string) => void,
}

const WhitelistAddAddressModal = ({ onClose, onSave }: AddModalProps) => {
    const [address, setAddress] = useState('')
    const { web3Error, checkingWeb3 } = useWeb3Status()

    if (!checkingWeb3 && web3Error) {
        return (
            <Web3ErrorDialog
                onClose={onClose}
                error={web3Error}
            />
        )
    }

    return (
        <ModalPortal>
            <Dialog
                title={I18n.t('modal.whitelistAdd.title')}
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
                                add: {
                                    title: I18n.t('modal.whitelistAdd.add'),
                                    kind: 'primary',
                                    onClick: () => onSave(address),
                                    disabled: !isEthereumAddress(address),
                                },
                            }}
                        />
                    </Footer>
                )}
            >
                <StyledLabel>
                    <Translate value="modal.whitelistAdd.addressLabel" />
                </StyledLabel>
                <Text
                    onCommit={(val) => setAddress(val)}
                    placeholder={I18n.t('modal.whitelistAdd.addressPlaceholder')}
                />
            </Dialog>
        </ModalPortal>
    )
}

export const WhitelistAddModal = () => {
    const { api, isOpen } = useModal('addWhitelistAddress')
    const { approve } = useWhitelist()

    if (!isOpen) {
        return null
    }

    return (
        <WhitelistAddAddressModal
            onSave={(result) => {
                approve(result)
                api.close({
                    save: true,
                    redirect: true,
                })
            }}
            onClose={() => api.close({
                save: false,
                redirect: false,
            })}
        />
    )
}

export type RemoveModalProps = {
    onClose: () => void,
    onSave: (string) => void,
    address: string,
}

const WhitelistRemoveAddressModal = ({ onClose, onSave, address }: RemoveModalProps) => {
    const { web3Error, checkingWeb3 } = useWeb3Status()

    if (!checkingWeb3 && web3Error) {
        return (
            <Web3ErrorDialog
                onClose={onClose}
                error={web3Error}
            />
        )
    }

    return (
        <ModalPortal>
            <Dialog
                title={I18n.t('modal.whitelistRemove.title')}
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
                                remove: {
                                    title: I18n.t('modal.whitelistRemove.remove'),
                                    kind: 'destructive',
                                    onClick: () => onSave(address),
                                    disabled: !isEthereumAddress(address),
                                },
                            }}
                        />
                    </Footer>
                )}
            >
                <Translate value="modal.whitelistRemove.message" dangerousHTML />
            </Dialog>
        </ModalPortal>
    )
}

export const WhitelistRemoveModal = () => {
    const { api, isOpen, value } = useModal('removeWhitelistAddress')
    const { reject } = useWhitelist()

    if (!isOpen) {
        return null
    }

    const { address } = value || {}

    return (
        <WhitelistRemoveAddressModal
            onSave={(result) => {
                reject(result)
                api.close({
                    save: true,
                    redirect: true,
                })
            }}
            onClose={() => api.close({
                save: false,
                redirect: false,
            })}
            address={address}
        />
    )
}

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
