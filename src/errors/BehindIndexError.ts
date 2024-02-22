export class BehindIndexError {
    /**
     * Initial block number can be set by the handler to mark
     * the starting point which then can help tracking progress.
     */
    private initialBlockNumber: number | undefined

    constructor(
        readonly expectedBlockNumber: number,
        readonly actualBlockNumber: number,
    ) {}

    progress() {
        return this.completed() / this.remaining()
    }

    setInitialBlockNumber(value: number | undefined, { overwrite = true } = {}) {
        if (this.initialBlockNumber != null && !overwrite) {
            return
        }

        if (value != null && this.actualBlockNumber < value) {
            /**
             * Don't allow initial block numbers higher than the
             * actual block number.
             */
            return
        }

        this.initialBlockNumber = value
    }

    completed() {
        return (
            this.actualBlockNumber - (this.initialBlockNumber ?? this.actualBlockNumber)
        )
    }

    remaining() {
        return (
            this.expectedBlockNumber - (this.initialBlockNumber ?? this.actualBlockNumber)
        )
    }
}
