// @flow

import React from 'react'
import PngIcon from '$shared/components/PngIcon'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

import styles from './insufficientDataDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const InsufficientDataDialog = ({ onCancel }: Props) => (
    <ModalPortal>
        <Dialog
            title="Insufficient DATA"
            onClose={onCancel}
        >
            <PngIcon
                className={styles.icon}
                name="walletNoData"
                alt="Insufficient DATA"
            />
            <p className={styles.message}>
                You don&apos;t have enough DATA to subscribe
                <br />
                to this product. Please get some and try again
            </p>
        </Dialog>
    </ModalPortal>
)

export default InsufficientDataDialog
