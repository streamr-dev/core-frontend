// @flow

export type Currency = 'USD' | 'DATA'

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

export type PayloadAction<P> = ReduxAction & {
    payload: P,
}
