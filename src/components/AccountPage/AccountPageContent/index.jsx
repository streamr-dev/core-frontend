// @flow

import React, { type Node } from 'react'
import { Container } from '@streamr/streamr-layout'

import styles from './accountPageContent.pcss'

type Props = {
    children: Node
}

const AccountPageContent = ({ children }: Props) => (
    <section className={styles.accountPageContent}>
        <Container>
            {children}
        </Container>
    </section>
)

export default AccountPageContent
