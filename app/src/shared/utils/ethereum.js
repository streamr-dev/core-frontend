/*
 * Basically 'ethereum-block-by-date' without moment
 * See: https://github.com/monosux/ethereum-block-by-date/blob/d9ea1733a8570c6dc39c06062f650a82b1d3db01/src/ethereum-block-by-date.js
 */
class EthDater {
    constructor(web3) {
        this.web3 = web3
        this.checkedBlocks = {}
        this.savedBlocks = {}
        this.requests = 0
    }

    async getBoundaries() {
        this.latestBlock = await this.getBlockWrapper('latest')
        this.firstBlock = await this.getBlockWrapper(1)
        this.blockTime = (parseInt(this.latestBlock.timestamp, 10)
            - parseInt(this.firstBlock.timestamp, 10)) / (parseInt(this.latestBlock.number, 10) - 1)
    }

    async getDate(date, after = true) {
        if (typeof this.firstBlock === 'undefined' ||
            typeof this.latestBlock === 'undefined' ||
            typeof this.blockTime === 'undefined') {
            await this.getBoundaries()
        }
        if (date < this.firstBlock.timestamp) {
            return this.returnWrapper(date, 1)
        }
        if (date >= this.latestBlock.timestamp) {
            return this.returnWrapper(date, this.latestBlock.number)
        }
        this.checkedBlocks[date] = []
        const predictedBlock = await this.getBlockWrapper(Math.ceil((date - this.firstBlock.timestamp) / this.blockTime))
        return this.returnWrapper(date, await this.findBetter(date, predictedBlock, after))
    }

    async findBetter(date, predictedBlock, after, blockTime = this.blockTime) {
        if (await this.isBetterBlock(date, predictedBlock, after)) {
            return predictedBlock.number
        }
        const difference = date - predictedBlock.timestamp
        let skip = Math.ceil(difference / blockTime)
        if (skip === 0) {
            skip = difference < 0 ? -1 : 1
        }
        const nextPredictedBlock = await this.getBlockWrapper(this.getNextBlock(date, predictedBlock.number, skip))
        const newBlockTime = Math.abs((parseInt(predictedBlock.timestamp, 10) - parseInt(nextPredictedBlock.timestamp, 10)) /
            (parseInt(predictedBlock.number, 10) - parseInt(nextPredictedBlock.number, 10)))
        return this.findBetter(date, nextPredictedBlock, after, newBlockTime)
    }

    async isBetterBlock(date, predictedBlock, after) {
        const blockTime = predictedBlock.timestamp
        if (after) {
            if (blockTime < date) {
                return false
            }
            const previousBlock = await this.getBlockWrapper(predictedBlock.number - 1)
            if (blockTime >= date && previousBlock.timestamp < date) {
                return true
            }
        } else {
            if (blockTime >= date) {
                return false
            }
            const nextBlock = await this.getBlockWrapper(predictedBlock.number + 1)
            if (blockTime < date && nextBlock.timestamp >= date) {
                return true
            }
        }
        return false
    }

    getNextBlock(date, currentBlock, skip) {
        const nextBlock = currentBlock + skip
        if (this.checkedBlocks[date].includes(nextBlock)) {
            return this.getNextBlock(date, currentBlock, (skip < 0 ? skip - 1 : skip + 1))
        }
        this.checkedBlocks[date].push(nextBlock)
        return nextBlock
    }

    returnWrapper(date, block) {
        return {
            date,
            block,
            timestamp: this.savedBlocks[block].timestamp,
        }
    }

    async getBlockWrapper(block) {
        let actualBlock = block === 'latest' ? await this.web3.eth.getBlockNumber() : block
        if (this.savedBlocks[actualBlock]) {
            return this.savedBlocks[actualBlock]
        }
        if (this.firstBlock != null && actualBlock < this.firstBlock.number) {
            actualBlock = this.firstBlock.number
        }
        if (this.latestBlock != null && actualBlock > this.latestBlock.number) {
            actualBlock = this.latestBlock.number
        }
        try {
            const { timestamp } = await this.web3.eth.getBlock(actualBlock)
            this.savedBlocks[actualBlock] = {
                timestamp,
                number: actualBlock,
            }
            this.requests += 1
        } catch (e) {
            console.error('Error getting block', e)
        }

        return this.savedBlocks[actualBlock]
    }
}

export const getBlockNumberForTimestamp = async (web3, timestampSecs) => {
    const dater = new EthDater(web3)
    const result = dater.getDate(timestampSecs)
    return result.block
}
