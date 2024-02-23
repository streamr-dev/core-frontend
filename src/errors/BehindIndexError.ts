export class BehindIndexError {
    constructor(
        readonly expectedBlockNumber: number,
        readonly actualBlockNumber: number,
    ) {}
}
