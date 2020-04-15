// @flow

import React, { type Node } from 'react'
import get from 'lodash/get'

import NoProductsView from '../NoProductsView'

const setup = {
    products: {
        errorView: <NoProductsView />,
        cols: {
            xs: 12,
            sm: 6,
            md: 3,
            lg: 'custom-products',
        },
    },
    relatedProducts: {
        errorView: <NoProductsView />,
        cols: {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 4,
        },
    },
}

export const getErrorView = (type: string): Node => get(setup, [type, 'errorView'])
export const getCols = (type: string) => get(setup, [type, 'cols'])
