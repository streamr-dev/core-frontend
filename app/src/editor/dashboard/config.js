/**
 * Adapted from engine-and-editor.
 */

import zipObject from 'lodash/zipObject'

const sizes = ['lg', 'md', 'sm', 'xs']
const modules = [
    'streamr-button',
    'streamr-chart',
    'streamr-heatmap',
    'streamr-input',
    'streamr-label',
    'streamr-map',
    'streamr-switcher',
    'streamr-table',
    'streamr-text-field',
]

const defaultLayout = {
    x: 0,
    y: 0,
    h: 2,
    w: 4,
    minH: 2,
    minW: 2,
}
const overridesBySize = {}
const overridesByModule = {
    'streamr-button': {
        w: 2,
    },
    'streamr-switcher': {
        w: 2,
    },
    'streamr-label': {
        w: 2,
    },
    'streamr-text-field': {
        w: 2,
        h: 3,
    },
    'streamr-map': {
        h: 6,
    },
    'streamr-heatmap': {
        h: 6,
    },
    'streamr-chart': {
        h: 6,
    },
    'streamr-table': {
        h: 6,
    },
}

const overridesBySizeAndModule = {}

export default {
    layout: {
        sizes,
        breakpoints: {
            lg: 1200,
            md: 996,
            sm: 768,
            xs: 480,
        },
        cols: {
            lg: 32,
            md: 20,
            sm: 8,
            xs: 4,
        },
        defaultLayout,
        layoutsBySizeAndModule: zipObject(sizes, sizes.map((size) => zipObject(modules, modules.map((module) => ({
            ...(size ? overridesBySize[size] : {}),
            ...(module ? overridesByModule[module] : {}),
            ...((size && module && overridesBySizeAndModule[size]) ? overridesBySizeAndModule[size][module] : {}),
        }))))),
    },
}
