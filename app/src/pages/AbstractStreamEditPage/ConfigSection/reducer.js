import cloneDeep from 'lodash/cloneDeep'
import { arrayMove } from 'react-sortable-hoc'

export const Init = 'init'

export const AddField = 'add field'

export const RearrangeFields = 'rearrange fields'

export const SetFieldName = 'set field name'

export const SetFieldType = 'set field type'

export const DeleteField = 'delete field'

export const Invalidate = 'invalidate'

export default function reducer(state, { type, payload }) {
    switch (type) {
        case Init:
            return {
                cache: 0,
                config: cloneDeep(payload || {
                    fields: [],
                }),
            }
        case Invalidate:
            return {
                ...state,
                cache: state.cache + 1,
            }
        case AddField:
            return {
                ...state,
                config: {
                    ...state.config,
                    fields: [
                        ...state.config.fields,
                        payload,
                    ],
                },
            }
        case RearrangeFields:
            return {
                ...state,
                config: {
                    ...state.config,
                    fields: (() => {
                        const [from, to] = payload
                        return arrayMove(state.config.fields, from, to)
                    })(),
                },
            }
        case SetFieldName:
            return {
                ...state,
                config: {
                    ...state.config,
                    fields: (() => {
                        const [oldName, newName] = payload

                        return state.config.fields.map((field) => (
                            field.name === oldName ? {
                                ...field,
                                name: newName,
                            } : field
                        ))
                    })(),
                },
            }
        case SetFieldType:
            return {
                ...state,
                config: {
                    ...state.config,
                    fields: (() => {
                        const [name, newType] = payload

                        return state.config.fields.map((field) => (
                            field.name === name ? {
                                ...field,
                                type: newType,
                            } : field
                        ))
                    })(),
                },
            }
        case DeleteField:
            return {
                ...state,
                config: {
                    ...state.config,
                    fields: state.config.fields.filter(({ name }) => name !== payload),
                },
            }
        default:
    }

    return state
}
