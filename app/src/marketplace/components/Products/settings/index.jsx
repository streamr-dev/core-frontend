// @flow

import React, { type Node } from 'react'
import get from 'lodash/get'

import NoProductsView from '../NoProductsView'

import type { ProductTileProps, ProductTilePropType } from '..'

const setup = {
    products: {
        tileProps: {
            showSubscriptionStatus: false,
        },
        errorView: <NoProductsView />,
        cols: {
            xs: 12,
            sm: 6,
            md: 3,
            lg: 'custom-products',
        },
    },
    relatedProducts: {
        tileProps: {
            showSubscriptionStatus: false,
        },
        errorView: <NoProductsView />,
        cols: {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 4,
        },
    },
}

export const getTileProps = (type: ProductTilePropType): ProductTileProps => get(setup, [type, 'tileProps'])
export const getErrorView = (type: string): Node => get(setup, [type, 'errorView'])
export const getCols = (type: string) => get(setup, [type, 'cols'])
