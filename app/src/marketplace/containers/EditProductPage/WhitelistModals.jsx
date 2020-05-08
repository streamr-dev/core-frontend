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
import withWeb3 from '$shared/utils/withWeb3'
import { isEthereumAddress } from '$mp/utils/validate'

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

const WhitelistAddAddressModalWithWeb3 = withWeb3(WhitelistAddAddressModal)

export const WhitelistAddModal = () => {
    const { api, isOpen } = useModal('addWhitelistAddress')
    const { approve } = useWhitelist()

    if (!isOpen) {
        return null
    }

    return (
        <WhitelistAddAddressModalWithWeb3
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

const WhitelistRemoveAddressModal = ({ onClose, onSave, address }: RemoveModalProps) => (
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

const WhitelistRemoveAddressModalWithWeb3 = withWeb3(WhitelistRemoveAddressModal)

export const WhitelistRemoveModal = () => {
    const { api, isOpen, value } = useModal('removeWhitelistAddress')
    const { reject } = useWhitelist()

    if (!isOpen) {
        return null
    }

    const { address } = value || {}

    return (
        <WhitelistRemoveAddressModalWithWeb3
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
}

const WhitelistRequestAccessModalComponent = ({ onClose }: RequestAccessModalProps) => (
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
                                onClick: () => console.log('save'),
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

export const WhitelistRequestAccessModal = () => {
    const { api, isOpen } = useModal('requestWhitelistAccess')

    if (!isOpen) {
        return null
    }

    return (
        <WhitelistRequestAccessModalComponent
            onClose={() => api.close({
                save: false,
                redirect: false,
            })}
        />
    )
}
