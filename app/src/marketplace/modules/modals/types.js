// @flow

import type { PayloadAction } from '$shared/flowtype/common-types'

export type ShowModalParam = {
    modalName: string,
    modalProps?: Object,
}

export type ShowModalAction = PayloadAction<ShowModalParam>

export type ShowModalActionCreator = (name: string, props?: Object) => ShowModalAction
