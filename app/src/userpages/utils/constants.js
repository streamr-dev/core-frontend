// @flow

import { I18n } from 'react-redux-i18n'
import type { SortOption } from '$userpages/flowtype/common-types'

export const defaultColumns = {
    xs: 12,
    sm: 6,
    md: 6,
    lg: 3,
}

/* eslint-disable arrow-body-style */
export const getFilters = (): { [string]: SortOption } => {
    return {
        RECENT: {
            displayName: I18n.t('userpages.filter.recent'),
            filter: {
                id: 'recent',
                sortBy: 'lastUpdated',
                order: 'desc',
            },
        },
        RUNNING: {
            displayName: I18n.t('userpages.filter.running'),
            filter: {
                id: 'running',
                key: 'state',
                value: 'RUNNING',
                order: 'desc',
            },
        },
        STOPPED: {
            displayName: I18n.t('userpages.filter.stopped'),
            filter: {
                id: 'stopped',
                key: 'state',
                value: 'STOPPED',
                order: 'desc',
            },
        },
        PUBLISHED: {
            displayName: I18n.t('userpages.filter.published'),
            filter: {
                id: 'published',
                key: 'states',
                value: 'DEPLOYED',
                order: 'desc',
            },
        },
        DRAFT: {
            displayName: I18n.t('userpages.filter.draft'),
            filter: {
                id: 'draft',
                key: 'states',
                value: 'NOT_DEPLOYED',
                order: 'desc',
            },
        },
        ACTIVE: {
            displayName: I18n.t('userpages.filter.active'),
            filter: {
                id: 'active',
                key: 'subscription',
                value: 'active',
                order: 'desc',
            },
        },
        EXPIRED: {
            displayName: I18n.t('userpages.filter.expired'),
            filter: {
                id: 'expired',
                key: 'subscription',
                value: 'expired',
                order: 'desc',
            },
        },
        SHARED: {
            displayName: I18n.t('userpages.filter.shared'),
            filter: {
                id: 'shared',
                key: 'operation',
                value: 'SHARE',
                order: 'desc',
            },
        },
        MINE: {
            displayName: I18n.t('userpages.filter.mine'),
            filter: {
                id: 'mine',
                key: 'operation',
                value: 'WRITE',
                order: 'desc',
            },
        },
        NAME_ASC: {
            displayName: I18n.t('userpages.filter.az'),
            filter: {
                id: 'az',
                sortBy: 'name',
                order: 'asc',
            },
        },
        NAME_DESC: {
            displayName: I18n.t('userpages.filter.za'),
            filter: {
                id: 'za',
                sortBy: 'name',
                order: 'desc',
            },
        },
        APPROVE: {
            displayName: I18n.t('userpages.filter.approve'),
            filter: {
                id: 'approve',
                key: 'state',
                value: 'PENDING',
                order: 'desc',
            },
        },
        REMOVE: {
            displayName: I18n.t('userpages.filter.remove'),
            filter: {
                id: 'remove',
                key: 'state',
                value: 'ACCEPTED',
                order: 'desc',
            },
        },
        REJECTED: {
            displayName: I18n.t('userpages.filter.rejected'),
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
