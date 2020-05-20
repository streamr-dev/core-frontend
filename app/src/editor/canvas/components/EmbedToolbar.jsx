import React from 'react'

import styles from './EmbedToolbar.pcss'
import LogoItem from '$shared/components/Logo'

import routes from '$routes'

function inIframe() {
    try {
        return window.self !== window.top
    } catch (e) {
        return true
    }
}

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
                href={routes.auth.login({
                    redirect: routes.canvases.edit({
                        id: canvas.id,
                    }),
                })}
                {...(inIframe() ? {
                    // open in new tab if in iframe
                    target: '_blank',
                    rel: 'noopener noreferrer',
                } : {})}
            >
                View on Streamr
            </a>
        </div>
    )
}

