/* eslint-disable global-require, import/no-dynamic-require, react/no-array-index-key */
// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import CanvasModuleHelp from '$docs/components/CanvasModuleHelp'
import DocsLayout from '$docs/components/DocsLayout'
import docsStyles from '$docs/components/DocsLayout/docsLayout.pcss'
import { canvasModulesCategorised } from '../data'

export default function ListModules() {
    return (
        <DocsLayout>
            <Helmet title="List Modules | Streamr Docs" />
            {(// $FlowFixMe
                Object.entries(canvasModulesCategorised).map(([category, helps]: [string, any[]]) => (
                    category === 'List' ?
                        (
                            <section key={category} className={docsStyles.canvasModule}>
                                <h1 className={docsStyles.mdH1}>{category}</h1>
                                {helps.map((m) => (
                                    <CanvasModuleHelp key={m.id} module={m} help={m.help} />
                                ))}
                            </section>
                        )
                        : null
                ))
            )}
        </DocsLayout>
    )
}
