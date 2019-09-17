import React from 'react'

import styles from './EmbedToolbar.pcss'
import LogoItem from '$shared/components/Logo'

import links from '../../../links'
import routes from '$routes'

export default function EmbedToolbar({ canvas }) {
    return (
        <div className={styles.root}>
            <a href={routes.root()} className={styles.logoLink}>
                <LogoItem className={styles.logo} />
            </a>
            <div className={styles.name}>
                {canvas.name}
            </div>
            <a
                className={styles.button}
                href={routes.login({
                    redirect: `${links.editor.canvasEditor}/${canvas.id}`,
                })}
                target="_blank"
                rel="noopener noreferrer"
            >
                View on Streamr
            </a>
        </div>
    )
}
