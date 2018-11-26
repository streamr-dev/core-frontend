// @flow

import { I18n } from 'react-redux-i18n'
import type { SortOption } from '$userpages/flowtype/common-types'

export const defaultColumns = {
    xs: 12,
    sm: 6,
    md: 6,
    lg: 3,
}

export const getDefaultSortOptions = (): Array<SortOption> => [
    {
        displayName: I18n.t('userpages.filter.recent'),
        filter: {
            id: 'recent',
            sortBy: 'lastUpdated',
            order: 'desc',
        },
    },
    {
        displayName: I18n.t('userpages.filter.running'),
        filter: {
            id: 'running',
            key: 'state',
            value: 'RUNNING',
            order: 'desc',
        },
    },
    {
        displayName: I18n.t('userpages.filter.stopped'),
        filter: {
            id: 'stopped',
            key: 'state',
            value: 'STOPPED',
            order: 'desc',
        },
    },
    {
        displayName: I18n.t('userpages.filter.shared'),
        filter: {
            id: 'shared',
            key: 'operation',
            value: 'SHARE',
            order: 'desc',
        },
    },
    {
        displayName: I18n.t('userpages.filter.mine'),
        filter: {
            id: 'mine',
            key: 'operation',
            value: 'WRITE',
            order: 'desc',
        },
    },
    {
        displayName: I18n.t('userpages.filter.az'),
        filter: {
            id: 'az',
            sortBy: 'name',
            order: 'asc',
        },
    },
    {
        displayName: I18n.t('userpages.filter.za'),
        filter: {
            id: 'za',
            sortBy: 'name',
            order: 'desc',
        },
    },
]
