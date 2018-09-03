// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'
import { Button } from 'reactstrap'

import styles from './externalLinkButton.pcss'

export type Props = {
    href: string,
    textI18nKey: string,
}

const ExternalLinkButton = ({ href, textI18nKey, ...props }: Props) => (
    <Button
        color="external-link"
        className={styles.button}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
    >
        <Translate
            value={textI18nKey}
            className="btn-external-text"
        />
        <span className="btn-external-expand-icon" />
    </Button>
)

export default ExternalLinkButton
