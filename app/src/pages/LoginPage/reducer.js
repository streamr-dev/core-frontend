export const Connect = 'connect'

export const Fail = 'fail'

export const Success = 'success'

export const initialState = {
    connecting: false,
    error: undefined,
    method: undefined,
}

export default function reducer(state, [type, payload]) {
    switch (type) {
        case Connect:
            return {
                ...state,
                method: payload,
                connecting: true,
                error: undefined,
            }
        case Fail:
            return {
                ...state,
                connecting: false,
                error: payload,
            }
        case Success:
            return {
                ...state,
                connecting: false,
            }
        default:
    }

    return state
}
