// @flow

import resourceUrl, { ResourceType, type ResourceID } from '$shared/utils/resourceUrl'

export default (id: ResourceID) => (
    `<iframe title="streamr-embed" src="${resourceUrl(ResourceType.CANVAS, id)}" width="640" height="360" frameborder="0"></iframe>`
)
