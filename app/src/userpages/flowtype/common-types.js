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

export type Filter = {
    search: ?string,
    sortBy: ?string,
}
