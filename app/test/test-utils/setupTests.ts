import { format } from 'util'
// TODO tests - delete or uncomment if not needed
// import moxios from 'moxios'
import dotenv from '../../scripts/dotenv'
import '@testing-library/jest-dom'
import './enzyme'
dotenv()

// TODO tests - delete or uncomment if not needed
// moxios.promiseWait = () => new Promise((resolve) => moxios.wait(resolve))

window.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0)
    return void(0)
}

// ensure unhandled rejections are logged
process.on('unhandledRejection', (err) => {
    process.stderr.write(`${format(err)}\n`)
    throw err
})
