// @flow

import { useMemo } from 'react'

import { formatExternalUrl } from '$shared/utils/url'
import type { ResourceType, ResourceId } from '$userpages/flowtype/permission-types'
import routes from '$routes'

const getEmbedCode = (resourceType: ResourceType, resourceId: ResourceId) => {
    if (resourceType === 'CANVAS') {
        const src = formatExternalUrl(process.env.PLATFORM_ORIGIN_URL, routes.canvasEmbed({
            id: resourceId,
        }))
        // $FlowFixMe It's alright but Flow doesn't get it
        return `
            <iframe title="streamr-embed"
            src="${src}"
            width="640" height="360"
            frameborder="0"></iframe>
        `.replace(/\s+/g, ' ').trim()
    }
    return ''
}

const getLinks = (resourceId: ResourceId) => ({
    CANVAS: `canvas/editor/${resourceId}`,
    DASHBOARD: `dashboard/editor/${resourceId}`,
    STREAM: `core/stream/show/${resourceId}`,
})

export function useEmbed(resourceType: ResourceType, resourceId: ResourceId) {
    const embedCode = getEmbedCode(resourceType, resourceId)

    const link = useMemo(() => {
        const links = getLinks(resourceId)

        return formatExternalUrl(process.env.PLATFORM_ORIGIN_URL, links[resourceType] || '')
    }, [resourceType, resourceId])

    return useMemo(() => ({
        embedCode,
        link,
    }), [embedCode, link])
}

export default useEmbed
