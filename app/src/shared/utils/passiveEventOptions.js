// Safe `passive` event listener support detection mechanism. It can be passed as the 3rd argument
// to `addEventListener` to improve performance of some event types. For more details visit:
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners

export default (() => {
    let options = false

    if (typeof window !== 'undefined') {
        try {
            window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
                // eslint-disable-next-line getter-return
                get: () => {
                    options = {
                        passive: true,
                        capture: false,
                    }
                },
            }))
        } catch (err) {
            // No-op.
        }
    }

    return options
})()
