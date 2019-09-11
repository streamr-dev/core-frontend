import React, { useEffect, useCallback, useState } from 'react'
import CanvasModuleHelp from '$docs/components/CanvasModuleHelp'
import useIsMounted from '$shared/hooks/useIsMounted'
import Empty from '$docs/components/CanvasModuleHelp/Empty'

const docs = require.context('$docs/content/canvasModules/', false, /\.jsx$/)

function ModuleHelp({ className, module: m }) {
    const moduleId = m.id
    const isMounted = useIsMounted()
    const [helpContent, setHelpContent] = useState({})
    const currentHelpContent = helpContent[moduleId]
    const hasCurrentContent = currentHelpContent != null

    const loadHelp = useCallback(() => {
        // ignore module name, just match on id
        const path = docs.keys().find((d) => d.endsWith(`-${moduleId}.jsx`))
        if (!path) {
            setHelpContent((state) => ({
                ...state,
                [moduleId]: Empty.help,
            }))
            return
        }
        import(`$docs/content/canvasModules/${path.slice(2)}`).then((result) => {
            if (!isMounted()) { return }
            setHelpContent((state) => ({
                ...state,
                [moduleId]: result.default.help,
            }))
        })
    }, [moduleId, setHelpContent, isMounted])

    useEffect(() => {
        if (hasCurrentContent) { return } // do nothing if already loaded help
        loadHelp()
    }, [loadHelp, hasCurrentContent])

    if (!m) { return null }

    return (
        <CanvasModuleHelp className={className} module={m} help={currentHelpContent} hideName />
    )
}

// ModuleHelp wrapper that returns empty if no module
export default function ({ module: m, ...props }) {
    if (!m) { return null }
    return <ModuleHelp module={m} {...props} />
}
