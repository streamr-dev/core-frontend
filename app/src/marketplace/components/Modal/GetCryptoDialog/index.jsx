// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import PngIcon from '$shared/components/PngIcon'
import Dialog from '$shared/components/Dialog'
import Button from '$shared/components/Button'
import Link from '$shared/components/Link'
import { isMobile } from '$shared/utils/platform'

import styles from './getCryptoDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const GetCryptoDialog = ({ onCancel }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.getCryptoDialog.title')}
            onClose={onCancel}
        >
            <PngIcon
                className={styles.icon}
                name="walletNoEth"
                alt={I18n.t('modal.getCryptoDialog.title')}
            />
            <Translate value="modal.getCryptoDialog.message" tag="p" dangerousHTML className={styles.message} />
            <Translate value="modal.getCryptoDialog.mobileMessage" tag="p" dangerousHTML className={styles.mobileMessage} />
            <div className={styles.buttonContainer}>
                <Button
                    className={styles.externalButton}
                    kind="secondary"
                    tag={Link}
                    href="https://coinbase.com"
                    target="_blank"
                >
                    <Translate value="modal.getCryptoDialog.link.coinbase" />
                </Button>
                <Button
                    className={styles.externalButton}
                    kind="secondary"
                    tag={Link}
                    href="https://binance.com"
                    target="_blank"
                >
                    <Translate value="modal.getCryptoDialog.link.binance" />
                </Button>
                <Button
                    className={styles.externalButton}
                    kind="secondary"
                    tag={Link}
                    href="https://uniswap.io"
                    target="_blank"
                >
                    <Translate value="modal.getCryptoDialog.link.uniswap" />
                </Button>
            </div>
        </Dialog>
    </ModalPortal>
)

export default GetCryptoDialog
