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
