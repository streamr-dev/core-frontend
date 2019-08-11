import groupBy from 'lodash/groupBy'

const importAll = (r) => r.keys().map(r).map(({ default: m }) => m)

// $FlowFixMe
export const canvasModules = importAll(require.context('$newdocs/content/canvasModules', false, /\.jsx$/))

export const canvasModulesCategorised = Object.entries((
    groupBy(canvasModules, ({ path }) => (
        // collapse category, only use first part e.g. Time Series: Random -> Time Series
        path.split(':')[0].trim()
    ))
))
    .sort((a, b) => a[0].localeCompare(b[0])) // sort category names
    .reduce((o, [k, v]) => Object.assign(o, {
        [k]: v.sort((a, b) => a.name.localeCompare(b.name)), // sort modules by name
    }), {})

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
