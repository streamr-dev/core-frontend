import React, { useEffect, useCallback, useState } from 'react'
import CanvasModuleHelp from '$newdocs/components/CanvasModuleHelp'
import useIsMounted from '$shared/hooks/useIsMounted'

export default function ModuleHelp({ className, module: m }) {
    const moduleId = m.id
    const cleanedName = m.name.replace(/\s/g, '').replace(/\(/g, '_').replace(/\)/g, '')
    const isMounted = useIsMounted()
    const [helpContent, setHelpContent] = useState({})
    const currentHelpContent = helpContent[moduleId]
    const hasCurrentContent = currentHelpContent != null

    const loadHelp = useCallback(() => {
        import(`$newdocs/content/canvasModules/${cleanedName}-${moduleId}.jsx`).then((result) => {
            if (!isMounted()) { return }
            setHelpContent((state) => ({
                ...state,
                [moduleId]: result.default.help,
            }))
        })
    }, [moduleId, cleanedName, setHelpContent, isMounted])

    useEffect(() => {
        if (hasCurrentContent) { return } // do nothing if already loaded help
        loadHelp()
    }, [loadHelp, hasCurrentContent])

    if (!m) { return null }

    return (
        <div className={className}>
            <CanvasModuleHelp module={m} help={currentHelpContent} hideName />
        </div>
    )
}
