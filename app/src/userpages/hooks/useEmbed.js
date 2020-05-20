// @flow

import { useMemo } from 'react'
import type { ResourceType, ResourceId } from '$userpages/flowtype/permission-types'
import canvasEmbedCode from '$shared/utils/canvasEmbedCode'
import resourceUrl from '$shared/utils/resourceUrl'

export default (resourceType: ResourceType, resourceId: ResourceId) => useMemo(() => ({
    embedCode: resourceType === 'CANVAS' ? canvasEmbedCode(resourceId) : '',
    link: resourceUrl(resourceType, resourceId),
}), [
    resourceType,
    resourceId,
])
