import get from 'lodash/get'

const setup = {
    projects: {
        cols: {
            xs: 12,
            sm: 6,
            md: 3,
            lg: 'custom-products',
        },
    },
    relatedProjects: {
        cols: {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 3,
        },
    },
}

export const getCols = (type: string) => get(setup, [type, 'cols'])
