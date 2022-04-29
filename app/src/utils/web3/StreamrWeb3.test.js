import Web3 from 'web3'
import StreamrWeb3 from './StreamrWeb3'

describe('StreamrWeb3', () => {
    it('extends Web3', () => {
        expect(StreamrWeb3.prototype).toBeInstanceOf(Web3)
    })
})
