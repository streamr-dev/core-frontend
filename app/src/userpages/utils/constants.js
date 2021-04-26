// @flow

import type { SortOption } from '$userpages/flowtype/common-types'

export const defaultColumns = {
    xs: 12,
    sm: 6,
    md: 6,
    lg: 3,
}

type ResourceType = 'stream' | 'product' | 'dataunion'

/* eslint-disable arrow-body-style */
export const getFilters = (resourceType: ResourceType): {
    [string]: SortOption,
} => {
    return {
        RECENT_DESC: {
            displayName: 'Recent',
            filter: {
                id: 'recent',
                sortBy: 'lastUpdated',
                order: 'desc',
            },
        },
        RECENT_ASC: {
            displayName: 'Oldest',
            filter: {
                id: 'oldest',
                sortBy: 'lastUpdated',
                order: 'asc',
            },
        },
        RUNNING: {
            displayName: 'Running',
            filter: {
                id: 'running',
                key: 'state',
                value: 'RUNNING',
                order: 'desc',
            },
        },
        STOPPED: {
            displayName: 'Stopped',
            filter: {
                id: 'stopped',
                key: 'state',
                value: 'STOPPED',
                order: 'desc',
            },
        },
        PUBLISHED: {
            displayName: 'Published',
            filter: {
                id: 'published',
                key: 'states',
                value: 'DEPLOYED',
                sortBy: 'lastUpdated',
                order: 'desc',
            },
        },
        DRAFTS: {
            displayName: 'Drafts',
            filter: {
                id: 'draft',
                key: 'states',
                value: 'NOT_DEPLOYED',
                sortBy: 'lastUpdated',
                order: 'desc',
            },
        },
        ACTIVE: {
            displayName: 'Active',
            filter: {
                id: 'active',
                key: 'subscription',
                value: 'active',
                order: 'desc',
            },
        },
        EXPIRED: {
            displayName: 'Expired',
            filter: {
                id: 'expired',
                key: 'subscription',
                value: 'expired',
                order: 'desc',
            },
        },
        SHARED: {
            displayName: 'Shared',
            filter: {
                id: 'shared',
                key: 'operation',
                value: `${resourceType}_share`,
                order: 'desc',
            },
        },
        MINE: {
            displayName: 'Mine',
            filter: {
                id: 'mine',
                key: 'operation',
                value: `${resourceType}_edit`,
                order: 'desc',
            },
        },
        NAME_ASC: {
            displayName: 'A to Z',
            filter: {
                id: 'az',
                sortBy: 'name',
                order: 'asc',
            },
        },
        NAME_DESC: {
            displayName: 'Z to A',
            filter: {
                id: 'za',
                sortBy: 'name',
                order: 'desc',
            },
        },
        APPROVE: {
            displayName: 'Approve',
            filter: {
                id: 'approve',
                key: 'state',
                value: 'PENDING',
                order: 'desc',
            },
        },
        REMOVE: {
            displayName: 'Remove',
            filter: {
                id: 'remove',
                key: 'state',
                value: 'ACCEPTED',
                order: 'desc',
            },
        },
        REJECTED: {
            displayName: 'Rejected',
            filter: {
                id: 'rejected',
                key: 'state',
                value: 'REJECTED',
                order: 'desc',
            },
        },
    }
}

export const streamListPageSize = 20
