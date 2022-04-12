import isEqual from 'lodash/isEqual'

export const Init = 'init'

export const SetBusy = 'set busy'

export const Modify = 'modify'

export const initialState = {
    busy: false,
    clean: true,
    params: {},
    paramsModified: {},
}

function toObject({
    id,
    description,
    config,
    storageDays,
    inactivityThresholdHours,
    partitions,
} = {}) {
    return {
        config,
        description,
        id,
        inactivityThresholdHours,
        partitions,
        storageDays,
    }
}

export default function reducer(state, { type, payload }) {
    switch (type) {
        case Init:
            return ((params = {}) => ({
                ...initialState,
                params,
                paramsModified: params,
            }))(toObject(payload))
        case SetBusy:
            return {
                ...state,
                busy: !!payload,
            }
        case Modify:
            return ((paramsModified) => ({
                ...state,
                paramsModified,
                clean: isEqual(state.params, paramsModified),
            }))({
                ...state.paramsModified,
                ...payload,
            })
        default:
    }

    return state
}
