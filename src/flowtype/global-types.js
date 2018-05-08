// @flow

declare class process {
    static env: {
        MARKETPLACE_API_URL: string,
        STREAMR_URL: string,
        MARKETPLACE_URL: string,
        STREAMR_WS_URL: string,
        [key: string]: ?string
    }
}
