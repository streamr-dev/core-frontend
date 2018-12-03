// @flow

import CancelledPromiseError from '$shared/errors/CancelledPromiseError'

export type Cancelable = {
    promise: Promise<any>,
    cancel: () => void,
}

/*
 * NOTE: Took it from https://github.com/facebook/react/issues/5465#issuecomment-157888325 and
 *       revamped it a little bit.
 */

const makeCancelable = (promise: Promise<any>) => {
    let hasCanceled = false

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) => (
            hasCanceled ? reject(new CancelledPromiseError()) : resolve(val)
        ))
        promise.catch((error) => (
            hasCanceled ? reject(new CancelledPromiseError()) : reject(error)
        ))
    })

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled = true
        },
    }
}

export default makeCancelable
