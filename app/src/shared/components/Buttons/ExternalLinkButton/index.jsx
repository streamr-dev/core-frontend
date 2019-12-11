// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import { Button } from 'reactstrap'

import styles from './externalLinkButton.pcss'

export type Props = {
    className?: ?string,
    href: string,
    textI18nKey: string,
}

const ExternalLinkButton = ({ className, href, textI18nKey, ...props }: Props) => (
    <Button
        {...props}
        color="external-link"
        className={className == null ? styles.button : className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
    >
        <Translate
            value={textI18nKey}
            className="btn-external-text"
        />
        <span className="btn-external-expand-icon" />
    </Button>
)

export default ExternalLinkButton
