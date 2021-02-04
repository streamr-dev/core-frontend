import { format } from 'util'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import moxios from 'moxios'
import dotenv from '../../scripts/dotenv'

dotenv()

jest.setTimeout(30000) // remove when we get --timeout jest 24.9.0

moxios.promiseWait = () => new Promise((resolve) => moxios.wait(resolve))

configure({
    adapter: new Adapter(),
})

window.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0)
}

// ensure unhandled rejections are logged
process.on('unhandledRejection', (err) => {
    process.stderr.write(`${format(err)}\n`)
    throw err
})
