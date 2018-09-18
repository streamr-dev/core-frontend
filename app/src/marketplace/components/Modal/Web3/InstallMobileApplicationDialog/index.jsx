// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'

import Dialog from '../../Dialog'
import withI18n from '../../../../containers/WithI18n'
import ExternalLinkButton from '../../../Buttons/ExternalLinkButton'

import styles from './installMobileApplicationDialog.pcss'

export type Props = {
    onCancel: () => void,
    translate: (key: string, options: any) => string,
}

const InstallMobileApplicationDialog = ({ onCancel, translate, ...props }: Props) => (
    <Dialog
        onClose={onCancel}
        title={translate('modal.web3.installmobileapplication.title')}
        {...props}
    >
        <p><Translate value="modal.web3.installmobileapplication.message" dangerousHTML /></p>

        <div className={styles.buttonContainer}>
            <ExternalLinkButton
                textI18nKey="modal.web3.installmobileapplication.app.trust"
                href="https://trustwalletapp.com/"
                className={styles.button}
            />
            <ExternalLinkButton
                textI18nKey="modal.web3.installmobileapplication.app.toshi"
                href="https://www.toshi.org/"
                className={styles.button}
            />
        </div>
    </Dialog>
)

export default withI18n(InstallMobileApplicationDialog)
