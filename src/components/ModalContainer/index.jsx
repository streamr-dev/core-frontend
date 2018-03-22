// @flow

import React from 'react'
import { ModalContainer as ReactRouterModalContainer } from 'react-router-modal'

import styles from './modalcontainer.pcss'

export const ModalContainer = () => (
    <ReactRouterModalContainer
        modalClassName={styles.modal}
        backdropClassName={styles.backdrop}
        containerClassName={styles.container}
        bodyModalOpenClassName={styles.modalOpen}
    />
)

export default ModalContainer
