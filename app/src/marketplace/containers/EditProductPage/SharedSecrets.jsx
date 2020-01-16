// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import SharedSecretEditor from './SharedSecretEditor'

import styles from './productStreams.pcss'

type Props = {
    className?: string,
}

const SharedSecrets = ({ className }: Props) => (
    <section id="shared-secrets" className={cx(styles.root, className)}>
        <Translate tag="h1" value="editProductPage.navigation.sharedSecrets" />
        <p>
            <Translate value="editProductPage.sharedSecrets.description" />
        </p>
        <SharedSecretEditor />
    </section>
)

export default SharedSecrets
