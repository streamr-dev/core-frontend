import debounce from 'lodash/debounce'

function unsavedUnloadWarning(event) {
    const confirmationMessage = 'You have unsaved changes'
    const evt = (event || window.event)
    evt.returnValue = confirmationMessage // Gecko + IE
    return confirmationMessage // Webkit, Safari, Chrome etc.
}

export default function Autosave(saveFn, opts) {
    // keep returning the same promise until autosave fires
    // resolve/reject autosave when debounce finally runs & save is complete
    function autosave(canvas, ...args) {
        function wait() {
            const pending = new Promise((resolve, reject) => {
                let canRun = true
                window.addEventListener('beforeunload', unsavedUnloadWarning)

                // warn user if changes not yet saved
                function reset() {
                    canRun = false
                    // clear state for next run
                    window.removeEventListener('beforeunload', unsavedUnloadWarning)
                    Object.assign(autosave, {
                        run: saveFn,
                        cancel: Function.prototype,
                        runLater: autosave,
                        pending: undefined,
                    })
                }

                async function cancel() {
                    reset()
                    console.info('Autosave cancelled', canvas.id) // eslint-disable-line no-console
                    return Promise.resolve(false).then(resolve, reject)
                }

                // capture debounced function
                async function run(canvas, ...args) {
                    if (!canRun) { return } // noop if cancelled
                    reset()
                    try {
                        const result = await saveFn(canvas, ...args)
                        // TODO: temporary logs until notifications work again
                        console.info('Autosaved', canvas.id) // eslint-disable-line no-console
                        resolve(result)
                    } catch (err) {
                        console.warn('Autosave failed', canvas.id, err) // eslint-disable-line no-console
                        reject(err)
                    }
                    return pending
                }

                Object.assign(autosave, {
                    run,
                    cancel,
                    runLater: debounce(run, opts),
                })
            })
            return pending
        }

        if (!autosave.pending) {
            autosave.pending = wait()
        }
        autosave.runLater(canvas, ...args) // run debounced save with latest args
        return autosave.pending
    }
    return Object.assign(autosave, {
        run: saveFn,
        runLater: autosave,
        cancel: Function.prototype,
    })
}
