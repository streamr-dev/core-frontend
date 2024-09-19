import '@testing-library/jest-dom'
import { format } from 'util'
import dotenv from '../../scripts/dotenv'
import '../../setup'

dotenv()

window.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0)
    return 0
}

// ensure unhandled rejections are logged
process.on('unhandledRejection', (err) => {
    process.stderr.write(`${format(err)}\n`)
    throw err
})
