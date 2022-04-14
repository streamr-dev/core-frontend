import { titleize } from '@streamr/streamr-layout'

function pluralize(word, { quantity = 0 } = {}) {
    return quantity === 1 ? word : `${word}s`
}

export default function getUnitSelectOptions(...units) {
    const copy = [...units]

    // Last item in `units` is the quantity for `pluralize`.
    const quantity = copy.pop()

    return copy.map((value) => ({
        value,
        label: pluralize(titleize(value), {
            quantity,
        }),
    }))
}
