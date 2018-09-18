// @flow

import React, { type Node } from 'react'

import { Container } from 'reactstrap'
import Buttons, { type ButtonActions } from '../Buttons/index'

import styles from './toolbar.pcss'

type Props = {
    status?: Node,
    actions?: ButtonActions,
}

const Toolbar = ({ status, actions }: Props) => (
    <Container className={styles.toolbar}>
        <div className={styles.left}>
            {status}
        </div>
        <div className={styles.right}>
            {actions && (
                <Buttons actions={actions} className={styles.buttons} />
            )}
        </div>
    </Container>
)

export default Toolbar
