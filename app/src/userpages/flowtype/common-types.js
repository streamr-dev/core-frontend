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

export type NumberString = string // Must be parsable to BigNumber

export type ErrorFromApi = {
    message: string,
    code?: string
}

export type ErrorInUi = {
    message: string,
    statusCode?: ?number,
    code?: ?string
}

export type ReduxAction = {
    type: string,
}

export type ReduxActionCreator = () => ReduxAction

export type PayloadAction<P> = ReduxAction & {
    payload: P,
}

export type ApiResult<T> = Promise<T>

export type RequestMethod = 'get' | 'post' | 'put' | 'delete'

export type PropertySetter<T> = (string, T) => void
