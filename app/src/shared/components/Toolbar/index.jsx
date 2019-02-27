// @flow

import React, { type Node } from 'react'

import { Container } from 'reactstrap'
import Buttons, { type ButtonActions } from '$shared/components/Buttons'

import styles from './toolbar.pcss'

type Props = {
    status?: Node,
    actions?: ButtonActions,
}

const Toolbar = ({ status, actions }: Props) => (
    <div className={styles.toolbar}>
        <Container>
            <div className={styles.left}>
                {status}
            </div>
            <div className={styles.right}>
                {actions && (
                    <Buttons actions={actions} className={styles.buttons} />
                )}
            </div>
        </Container>
    </div>
)

export default Toolbar
