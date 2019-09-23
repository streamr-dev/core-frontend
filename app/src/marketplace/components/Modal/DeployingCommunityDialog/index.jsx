// @flow

import React, { useCallback, useEffect, useState } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import cx from 'classnames'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { type Product } from '$mp/flowtype/product-types'
import { deployContract as deploy, createJoinPartStream } from '$mp/modules/communityProduct/services'
import DeploySpinner from '$shared/components/DeploySpinner'

import styles from './deployingCommunityDialog.pcss'

export type Props = {
    product: Product,
    api: Object,
}

const formatSeconds = (seconds) => {
    // $FlowFixMe
    const timeValue = new Date(seconds * 1000).toUTCString().match(/\d\d:\d\d:\d\d/)[0]

    return timeValue.substr(0, 2) === '00' ? timeValue.substr(3) : timeValue
}

const DeployingCommunityDialog = ({ product, api }: Props) => {
    const estimate = 205
    const [isDeploying, setIsDeploying] = useState(false)

    const deployContract = useCallback(async () => {
        if (product && product.id) {
            const joinPartStream = await createJoinPartStream(product.name)
            if (joinPartStream == null) {
                console.error('Could not create JoinPartStream for community product')
                return
            }

            const tx = deploy(joinPartStream.id)
            tx.onTransactionHash(() => {
                setIsDeploying(true)
            })
            tx.onTransactionComplete(() => {
                setIsDeploying(false)
                Notification.push({
                    title: 'Deploy completed',
                    icon: NotificationIcon.CHECKMARK,
                })
            })
            tx.onError((err) => {
                setIsDeploying(false)
                console.error('CP deploy: Error', err)
                Notification.push({
                    title: 'Deploy failed',
                    description: err.message,
                    icon: NotificationIcon.ERROR,
                })
            })
        }
    }, [product])

    useEffect(() => {
        deployContract()
    }, [deployContract])

    return (
        <Modal>
            <Dialog
                className={cx(styles.root, styles.DeployingCommunityDialog)}
                title={I18n.t('modal.deployCommunity.deploying.title', {
                    name: product.name,
                })}
                onClose={() => api.close(false)}
                contentClassName={styles.content}
                actions={{
                    continue: {
                        title: I18n.t('modal.common.close'),
                        outline: true,
                        onClick: () => api.close(true),
                    },
                }}
            >
                <div className={styles.spinner}>
                    <DeploySpinner isRunning={isDeploying} showCounter />
                </div>
                <div className={styles.description}>
                    <Translate
                        value="modal.deployCommunity.deploying.description"
                        time={formatSeconds(estimate)}
                        dangerousHTML
                    />
                </div>
            </Dialog>
        </Modal>
    )
}

export default DeployingCommunityDialog
