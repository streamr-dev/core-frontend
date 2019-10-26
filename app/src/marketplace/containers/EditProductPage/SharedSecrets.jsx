// @flow

import React from 'react'
import cx from 'classnames'
import ScrollableAnchor from 'react-scrollable-anchor'
import { Translate } from 'react-redux-i18n'

import SharedSecretEditor from './SharedSecretEditor'

import styles from './productStreams.pcss'

type Props = {
    className?: string,
}

const SharedSecrets = ({ className }: Props) => (
    <ScrollableAnchor id="shared-secrets">
        <div className={cx(styles.root, className)}>
            <h1><Translate value="editProductPage.navigation.sharedSecrets" /></h1>
            <p>
                <Translate value="editProductPage.sharedSecrets.description" />
            </p>
            <SharedSecretEditor />
        </div>
    </ScrollableAnchor>
)

export default SharedSecrets
