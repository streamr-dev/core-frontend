// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import { Container } from 'reactstrap'
import styles from './copyright.pcss'

const Copyright = () => (
    <div className={styles.copyright}>
        <div className={styles.inner}>
            <Container>
                <Translate value="general.footnote" dangerousHTML />
            </Container>
        </div>
    </div>
)

export default Copyright
