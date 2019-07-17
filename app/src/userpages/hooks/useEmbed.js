// @flow

import { useMemo } from 'react'

import { formatExternalUrl } from '$shared/utils/url'
import type { ResourceType, ResourceId } from '$userpages/flowtype/permission-types'

const streamrRoot = process.env.STREAMR_URL || ''

const getEmbedCodes = (resourceType: ResourceType, resourceId: ResourceId) => ({
    // $FlowFixMe It's alright but Flow doesn't get it
    CANVAS: String.raw`<iframe title="streamr-embed"
src="http://streamr.com/embed/${resourceType}/${resourceId}"
width="640" height="360"
frameborder="0"></iframe>`,
    DASHBOARD: '',
    STREAM: '',
})

const getLinks = (resourceId: ResourceId) => ({
    CANVAS: `canvas/editor/${resourceId}`,
    DASHBOARD: `dashboard/editor/${resourceId}`,
    STREAM: `core/stream/show/${resourceId}`,
})

export function useEmbed(resourceType: ResourceType, resourceId: ResourceId) {
    const embedCode = useMemo(() => {
        const codes = getEmbedCodes(resourceType, resourceId)

        return codes[resourceType] || ''
    }, [resourceType, resourceId])

    const link = useMemo(() => {
        const links = getLinks(resourceId)

        return formatExternalUrl(streamrRoot, links[resourceType] || '')
    }, [resourceType, resourceId])

    return useMemo(() => ({
        embedCode,
        link,
    }), [embedCode, link])
}

export default useEmbed
