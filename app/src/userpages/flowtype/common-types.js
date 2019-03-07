// @flow

import type { Webcomponent } from './webcomponent-types'

export type UiChannel = {
    id: string,
    webcomponent: $ElementType<Webcomponent, 'type'>,
    name: string
}

export type OnSubmitEvent = {
    target: HTMLFormElement
} & Event

export type SortOrder = 'desc' | 'asc'

export type Filter = {
    id: string,
    search?: ?string,
    sortBy?: ?string,
    order?: ?SortOrder,
    key?: ?string,
    value?: ?string,
    adhoc?: boolean,
    uiChannel?: boolean,
    public?: boolean,
}

export type SortOption = {
    displayName: string,
    filter: Filter,
}
