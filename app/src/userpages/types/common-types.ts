import { $ElementType } from 'utility-types'
import { Webcomponent } from './webcomponent-types'
export type UiChannel = {
    id: string
    webcomponent: $ElementType<Webcomponent, 'type'>
    name: string
}
export type OnSubmitEvent = {
    target: HTMLFormElement
} & Event
export type SortOrder = 'desc' | 'asc'
export type Filter = {
    id: string
    search?: string | null | undefined
    sortBy?: string | null | undefined
    order?: SortOrder | null | undefined
    key?: string | null | undefined
    value?: string | null | undefined
    adhoc?: boolean
    uiChannel?: boolean
    public?: boolean
}
export type SortOption = {
    displayName: string
    filter: Filter
}
