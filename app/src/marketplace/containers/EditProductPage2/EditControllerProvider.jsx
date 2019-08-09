// @flow

import React, { type Node, type Context, useState, useMemo } from 'react'

import type { Product } from '$mp/flowtype/product-types'

type ContextProps = {
    isPreview: boolean,
    setIsPreview: (boolean | Function) => void,
}

const EditControllerContext: Context<ContextProps> = React.createContext({})

function useEditController(product: Product) {
    console.log(product)
    const [isPreview, setIsPreview] = useState(false)

    return useMemo(() => ({
        isPreview,
        setIsPreview,
    }), [
        isPreview,
        setIsPreview,
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
