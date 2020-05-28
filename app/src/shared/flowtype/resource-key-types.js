// @flow

export type ResourceKeyId = string

export type ResourceType = 'STREAM' | 'USER'

// eslint-disable-next-line max-len
export type ResourcePermission = 'stream_get' | 'stream_edit' | 'stream_delete' | 'stream_publish' | 'stream_subscribe' | 'stream_share' | 'canvas_get' | 'canvas_edit' | 'canvas_delete' | 'canvas_startstop' | 'canvas_interact' | 'canvas_share' | 'dashboard_get' | 'dashboard_edit' | 'dashboard_delete' | 'dashboard_interact' | 'dashboard_share' | 'product_get' | 'product_edit' | 'product_delete' | 'product_share'

export type ResourceKey = {
    id?: ResourceKeyId,
    name: string,
    user?: ?string,
    permission?: ResourcePermission,
    type: ResourceType,
}

export type ResourceKeyIdList = Array<ResourceKeyId>

export type ResourceKeyList = Array<ResourceKey>

export type ResourceKeyEntities = {
    [ResourceKeyId]: ResourceKey,
}
