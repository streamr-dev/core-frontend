import Emitter from 'events'
import debounce from 'lodash/debounce'

function unsavedUnloadWarning(event) {
    const confirmationMessage = 'You have unsaved changes'
    const evt = (event || window.event)
    evt.returnValue = confirmationMessage // Gecko + IE
    return confirmationMessage // Webkit, Safari, Chrome etc.
}

export function CancellableDebounce(fn, waitTime) {
    const emitter = new Emitter()

    // keep returning the same promise until autosave fires
    // resolve/reject autosave when debounce finally runs & save is complete
    function autosave(...args) {
        function wait() {
            const pending = new Promise((resolve, reject) => {
                let canRun = true
                emitter.emit('start', ...args)

                // warn user if changes not yet saved
                function reset() {
                    canRun = false
                    // clear state for next run
                    emitter.emit('reset', undefined, ...args)
                    Object.assign(autosave, {
                        run: fn,
                        cancel: Function.prototype,
                        runLater: autosave,
                        pending: undefined,
                    })
                }

                async function cancel() {
                    reset()
                    emitter.emit('cancel', undefined, ...args)
                    return Promise.resolve(false).then(resolve, reject)
                }

                // capture debounced function
                function run(...args) {
                    if (!canRun) { return } // noop if cancelled
                    emitter.emit('run', ...args)

                    reset()
                    fn(...args).then((result) => {
                        emitter.emit('done', result, ...args)
                        return resolve(result)
                    }, (error) => {
                        // emits fail instead of error as we don't want unhandled error bubbling behaviour
                        emitter.emit('fail', error, ...args)
                        return reject(error)
                    })
                    return pending
                }

                Object.assign(autosave, {
                    run,
                    cancel,
                    runLater: debounce(run, waitTime),
                })
            })
            return pending
        }

        if (!autosave.pending) {
            autosave.pending = wait()
        }
        autosave.runLater(...args) // run debounced save with latest args
        return autosave.pending
    }

    return Object.assign(autosave, {
        run: fn,
        runLater: autosave,
        cancel: Function.prototype,
        emitter,
        on: emitter.on.bind(emitter),
        off: emitter.removeListener.bind(emitter),
        once: emitter.once.bind(emitter),
    })
}

/**
 * Autosave is basically a cancellable debounce with a beforeunload handler.
 */

export default function Autosave(saveFn, waitTime) {
    const debounced = CancellableDebounce(saveFn, waitTime)
    debounced
        .on('done', (_, canvas = {}) => {
            console.info('Autosaved', canvas.id) // eslint-disable-line no-console
        })
        .on('cancel', (_, canvas = {}) => {
            console.info('Autosave cancelled', canvas.id) // eslint-disable-line no-console
        })
        .on('fail', (err, canvas = {}) => {
            console.warn('Autosave failed', canvas.id, err) // eslint-disable-line no-console
        })
        .on('run', (canvas = {}) => {
            console.info('Autosaving...', canvas.id) // eslint-disable-line no-console
        })
        .on('start', () => {
            window.addEventListener('beforeunload', unsavedUnloadWarning)
        })
        .on('reset', () => {
            window.removeEventListener('beforeunload', unsavedUnloadWarning)
        })
    return debounced
}
