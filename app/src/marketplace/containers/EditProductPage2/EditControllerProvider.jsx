// @flow

import React, { type Node, type Context, useState, useMemo, useCallback, useContext } from 'react'

import type { Product } from '$mp/flowtype/product-types'

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

import { Context as ValidationContext, ERROR } from '../ProductController/ValidationContextProvider'

type ContextProps = {
    isPreview: boolean,
    setIsPreview: (boolean | Function) => void,
    save: () => void,
}

const EditControllerContext: Context<ContextProps> = React.createContext({})

function useEditController(product: Product) {
    const [isPreview, setIsPreview] = useState(false)

    const { status } = useContext(ValidationContext)

    // $FlowFixMe
    const errors = useMemo(() => Object.keys(status).filter((key) => status[key] && status[key].level === ERROR), [status])

    const save = useCallback(() => {
        if (errors.length > 0) {
            // Not using `Object.values` because of flow (mixed vs string).
            errors.forEach((key) => {
                Notification.push({
                    title: status[key].message,
                    icon: NotificationIcon.ERROR,
                })
            })
        } else {
            console.log(product)
            alert('ok')
        }
    }, [product, errors, status])

    return useMemo(() => ({
        isPreview,
        setIsPreview,
        save,
    }), [
        isPreview,
        setIsPreview,
        save,
    ])
}

type ControllerProps = {
    children?: Node,
    product: Product,
}

function EditControllerProvider({ children, product }: ControllerProps) {
    return (
        <EditControllerContext.Provider value={useEditController(product)}>
            {children || null}
        </EditControllerContext.Provider>
    )
}

export {
    EditControllerContext as Context,
    EditControllerProvider as Provider,
}
