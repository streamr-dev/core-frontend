// @flow

import * as modals from '../utils/modals'

export type Currency = 'USD' | 'DATA'

declare class process {
    static env: {
        MARKETPLACE_API_URL: string
    }
}

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

export type ApiResult = Promise<any>

export type ModalId = $Values<typeof modals>

export type Purchase = {
    step: string,
    time?: number,
    timeUnit?: string,
    price?: number,
    priceUnit?: string,
}

export type ModalProps = Purchase

export type Modal = {
    id: ModalId,
    props?: ModalProps,
}
