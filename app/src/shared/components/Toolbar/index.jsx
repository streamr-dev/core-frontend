// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import { Container } from 'reactstrap'
import Buttons, { type ButtonActions } from '$shared/components/Buttons'

import styles from './toolbar.pcss'

type Props = {
    status?: Node,
    actions?: ButtonActions,
    altMobileLayout?: boolean,
}

const Toolbar = ({ status, actions, altMobileLayout }: Props) => (
    <div
        className={cx(styles.toolbar, {
            [styles.altMobileLayout]: altMobileLayout,
        })}
    >
        <Container className={styles.container}>
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
