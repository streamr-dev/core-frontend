import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import moxios from 'moxios'
import dotenv from '../../scripts/dotenv'

dotenv()

jest.setTimeout(10000) // remove when we get --timeout jest 24.9.0

moxios.promiseWait = () => new Promise((resolve) => moxios.wait(resolve))

configure({
    adapter: new Adapter(),
})

window.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0)
}
