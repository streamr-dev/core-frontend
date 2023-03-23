import { ReactNode } from 'react'
import React from 'react'
import get from 'lodash/get'
import NoProductsView from '../NoProductsView'
const setup = {
    projects: {
        errorView: <NoProductsView />,
        cols: {
            xs: 12,
            sm: 6,
            md: 3,
            lg: 'custom-products',
        },
    },
    relatedProjects: {
        errorView: <NoProductsView />,
        cols: {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 3,
        },
    },
}
export const getErrorView = (type: string): ReactNode => get(setup, [type, 'errorView'])
export const getCols = (type: string) => get(setup, [type, 'cols'])
