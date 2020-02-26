// @flow

import React from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import cx from 'classnames'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import { type Product } from '$mp/flowtype/product-types'
import DeploySpinner from '$shared/components/DeploySpinner'
import Buttons from '$shared/components/Buttons'

import styles from './deployingDataUnionDialog.pcss'

export type Props = {
    product: Product,
    estimate: number,
    onClose: () => void,
    onContinue: () => void,
    minimized?: boolean,
}

const formatSeconds = (seconds) => {
    const timeValue = (new Date(seconds * 1000).toUTCString().match(/\d\d:\d\d:\d\d/) || ['00:00:00'])[0]

    return timeValue.substr(0, 2) === '00' ? timeValue.substr(3) : timeValue
}

const DeployingDataUnionDialog = ({
    product,
    estimate,
    onClose,
    onContinue,
    minimized,
}: Props) => (
    <ModalPortal>
        <Dialog
            className={cx(styles.root, styles.DeployingDataUnionDialog)}
            title={I18n.t('modal.deployDataUnion.deploying.title', {
                name: product.name,
            })}
            onClose={onClose}
            contentClassName={cx({
                [styles.content]: !minimized,
                [styles.contentMinimized]: !!minimized,
            })}
            containerClassname={cx({
                [styles.dialogContainer]: !minimized,
                [styles.dialogContainerMinimized]: !!minimized,
            })}
            renderActions={() => (
                <div className={styles.footer}>
                    <div className={styles.footerText}>
                        {!!minimized && (
                            <React.Fragment>
                                <span className={styles.estimatedTime}>{formatSeconds(estimate)}</span>
                                &nbsp;
                                <Translate value="modal.deployDataUnion.deploying.estimatedDeploymentTime" />
                            </React.Fragment>
                        )}
                    </div>
                    <Buttons
                        actions={{
                            continue: {
                                title: I18n.t('modal.common.close'),
                                outline: true,
                                onClick: () => onContinue(),
                            },
                        }}
                    />
                </div>
            )}
        >
            <div className={styles.spinner}>
                <DeploySpinner isRunning showCounter />
            </div>
            {!minimized && (
                <div className={styles.description}>
                    <Translate
                        value="modal.deployDataUnion.deploying.description"
                        time={formatSeconds(estimate)}
                        dangerousHTML
                    />
                </div>
            )}
        </Dialog>
    </ModalPortal>
)

export default DeployingDataUnionDialog
