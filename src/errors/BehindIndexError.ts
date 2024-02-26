import { isMessagedObject } from '~/utils/exceptions'

export class BehindIndexError {
    constructor(
        readonly expectedBlockNumber: number,
        readonly actualBlockNumber: number,
    ) {}
}

export function prehandleBehindBlockError(e: unknown, expectedBlockNumber: number) {
    /**
     * api.thegraph.com responds with the following error response for future blocks:
     * "indexed up to block number <X> and data for block number <Y> is therefore not yet available"
     */
    const blockRegexp0 = /indexed up to block number (\d+)/i

    /**
     * gateway-arbitrum.network.thegraph.com responds with the following error response for future blocks:
     * "block not found: <Z>"
     */
    const blockRegexp1 = /block not found: (\d+)/i

    if (!isMessagedObject(e)) {
        return
    }

    if (blockRegexp0.test(e.message)) {
        throw new BehindIndexError(
            expectedBlockNumber,
            Number(e.message.match(blockRegexp0)![1]),
        )
    }

    if (blockRegexp1.test(e.message)) {
        /**
         * Block number in the error message (see `blockRegexp1`) could not be found thus the latest
         * ingested one is the one prior.
         */
        throw new BehindIndexError(
            expectedBlockNumber,
            Number(e.message.match(blockRegexp1)![1]) - 1,
        )
    }
}
