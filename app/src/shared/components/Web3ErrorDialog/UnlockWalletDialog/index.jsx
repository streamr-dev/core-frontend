// @flow

import React, { type Node } from 'react'
import { I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import PngIcon, { type PngIconName } from '$shared/components/PngIcon'
import { truncate } from '$shared/utils/text'

import styles from './unlockWalletDialog.pcss'

type Props = {
    title?: string,
    onClose: () => void,
    waiting?: boolean,
    children?: Node,
    icon?: PngIconName,
    requiredAddress?: string,
}

const UnlockWalletDialog = ({
    title,
    onClose,
    children,
    waiting,
    icon = 'wallet',
    requiredAddress,
    ...props
}: Props) => (
    <ModalPortal>
        <Dialog
            {...props}
            onClose={onClose}
            title={!waiting ? title || I18n.t('modal.unlockWallet.title') : I18n.t('modal.unlockWallet.waiting')}
            waiting={waiting}
            className={styles.dialog}
        >
            <PngIcon name={icon} className={styles.icon} />
            {children}
            {!!requiredAddress && (
                <div className={styles.addressWrapper}>
                    <span
                        className={styles.address}
                        title={requiredAddress}
                    >
                        {truncate(requiredAddress, {
                            maxLength: 15,
                        })}
                    </span>
                </div>
            )}
        </Dialog>
    </ModalPortal>
)

export default UnlockWalletDialog
