// @flow

export type ResourceKeyId = string

export type ResourceType = 'STREAM' | 'USER'

export type ResourcePermission = 'read' | 'write' | 'share'

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
