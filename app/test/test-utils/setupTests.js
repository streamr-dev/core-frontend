import { format } from 'util'
import moxios from 'moxios'
import dotenv from '../../scripts/dotenv'
import '@testing-library/jest-dom'
import './enzyme'

dotenv()

jest.setTimeout(30000) // remove when we get --timeout jest 24.9.0

moxios.promiseWait = () => new Promise((resolve) => moxios.wait(resolve))

window.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0)
}

// ensure unhandled rejections are logged
process.on('unhandledRejection', (err) => {
    process.stderr.write(`${format(err)}\n`)
    throw err
})
