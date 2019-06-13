export default {
    'min/max': (points) => {
        // Smarter data grouping: for all-positive values choose max, for all-negative choose min, for neither choose avg
        const { min, max, sum } = points.reduce(({ min, max, sum }, point) => ({
            sum: sum + point,
            min: Math.min(it, min),
            max: Math.max(it, max),
        }), {
            sum: 0,
            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY,
        })

        if (!points.length && points.hasNulls) {
            // If original had only nulls, Highcharts expects null
            return null
        } else if (!points.length) {
            // "Ordinary" empty group, Highcharts expects undefined
            return undefined
        } else if (min >= 0) {
            // All positive
            return max
        } else if (max <= 0) {
            // All negative
            return min
        }
        // Mixed positive and negative
        return sum / points.length
    },
    average: 'average',
    open: 'open',
    high: 'high',
    low: 'low',
    close: 'close',
}
