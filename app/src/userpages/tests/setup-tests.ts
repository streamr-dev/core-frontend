import moxios from 'moxios'
import '../../../test/test-utils/enzyme'

moxios.promiseWait = () => new Promise((resolve) => moxios.wait(resolve))

window.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0)
}
