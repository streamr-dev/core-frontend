// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import CanvasModuleHelp from '$docs/components/CanvasModuleHelp'
import DocsLayout from '$docs/components/DocsLayout'
import docsStyles from '$docs/components/DocsLayout/docsLayout.pcss'
import { canvasModulesCategorised } from '../data'
import styles from './helpModules.pcss'

type Props = {
    category: string,
    pageTitle: string,
}

export default function HelpModules({ category, pageTitle }: Props) {
    const helps = canvasModulesCategorised[category]
    return (
        <DocsLayout>
            <DocsHelmet title={pageTitle} />
            <section key={category} className={docsStyles.canvasModule}>
                <h1 className={docsStyles.mdH1}>{category}</h1>
                <hr className={styles.divider} />
                {helps.map((m) => (
                    <CanvasModuleHelp key={m.id} module={m} help={m.help} />
                ))}
            </section>
        </DocsLayout>
    )
}
