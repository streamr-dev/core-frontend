/**
 * @param e probably `Event` himself!
 * @returns `true` if the given entity has the `preventDefault` function and the `defaultPrevented` flag.
 */
export default function isPreventable(e: unknown): e is Event {
    return (
        typeof e === 'object' &&
        !!e &&
        'preventDefault' in e &&
        typeof e.preventDefault === 'function' &&
        'defaultPrevented' in e &&
        typeof e.defaultPrevented === 'boolean'
    )
}
