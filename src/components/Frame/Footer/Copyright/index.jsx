// @flow

import React from 'react'
import { Container } from '@streamr/streamr-layout'
import { Translate } from 'react-redux-i18n'
import styles from './copyright.pcss'

const Copyright = () => (
    <div className={styles.copyright}>
        <div className={styles.inner}>
            <Container>
                <Translate value="footer.companyText" dangerousHTML />
            </Container>
        </div>
    </div>
)

export default Copyright
