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

function toObject({ id, metadata } = { id: '', metadata: {} }) {
    return {
        id,
        metadata,
    }
}

export default function reducer(state, { type, payload }) {
    switch (type) {
        case Init:
            return ((params = { id: '', metadata: {}}) => ({ ...initialState, params, paramsModified: params }))(toObject(payload))

        case SetBusy:
            return { ...state, busy: !!payload }

        case Modify:
            return ((paramsModified) => ({ ...state, paramsModified, clean: isEqual(state.params, paramsModified) }))({
                ...state.paramsModified,
                ...(payload.metadata ?
                    {
                        metadata: {
                            ...state.paramsModified.metadata,
                            ...payload.metadata,
                        }
                    }
                    :
                    payload),
            })

        default:
    }

    return state
}
