import groupBy from 'lodash/groupBy'

const importAll = (r) => r.keys().map(r).map(({ default: m }) => m)

// $FlowFixMe
export const canvasModules = importAll(require.context('$newdocs/content/canvasModules', false, /\.jsx$/))
export const canvasModulesCategorised = groupBy(canvasModules, ({ path }) => path.split(':')[0])

/**
 * Convert category name into suitable anchor
 * e.g. Time & Date -> time-and-date
 */
export const toAnchor = (name) => (
    name.trim()
        .toLowerCase()
        .replace(' & ', ' and ')
        .replace(/\s+/g, '-')
)
