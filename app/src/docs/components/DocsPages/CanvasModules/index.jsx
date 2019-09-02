/* eslint-disable global-require, import/no-dynamic-require, react/no-array-index-key */
// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import CanvasModuleHelp from '$docs/components/CanvasModuleHelp'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import docsStyles from '$docs/components/DocsLayout/docsLayout.pcss'

import { canvasModulesCategorised, toAnchor } from './data'

export default function CanvasModules() {
    return (
        <DocsLayout subNav={subNav.canvasModules}>
            <Helmet title="Canvas Modules | Streamr Docs" />
            {(// $FlowFixMe
                Object.entries(canvasModulesCategorised).map(([category, helps]: [string, any[]]) => (
                    <section key={category} id={toAnchor(category)} className={docsStyles.canvasModule}>
                        <h1 className={docsStyles.mdH1}>{category}</h1>
                        {helps.map((m) => (
                            <CanvasModuleHelp key={m.id} module={m} help={m.help} />
                        ))}
                    </section>
                ))
            )}
        </DocsLayout>
    )
}
