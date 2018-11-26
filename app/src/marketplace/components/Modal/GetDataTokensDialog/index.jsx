// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import NoDataPng from '../../../assets/wallet_no_data.png'
import NoDataPng2x from '../../../assets/wallet_no_data@2x.png'
import Dialog from '../Dialog'
import withI18n from '../../../containers/WithI18n'
import ExternalLinkButton from '$shared/components/Buttons/ExternalLinkButton'

import styles from './getDataTokensDialog.pcss'

export type Props = {
    onCancel: () => void,
    translate: (key: string, options: any) => string,
}

const GetDataTokensDialog = ({ onCancel, translate }: Props) => (
    <Dialog
        title={translate('modal.getDataTokensDialog.title')}
        onClose={onCancel}
    >
        <img className={styles.icon} src={NoDataPng} srcSet={`${NoDataPng2x} 2x`} alt={translate('error.wallet')} />
        <Translate value="modal.getDataTokensDialog.message" className={styles.message} />

        <div className={styles.buttonContainer}>
            <ExternalLinkButton
                textI18nKey="modal.getDataTokensDialog.link.bancor"
                href="https://www.bancor.network/"
                className={styles.button}
            />
        </div>
    </Dialog>
)

export default withI18n(GetDataTokensDialog)
