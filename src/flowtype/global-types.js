// @flow

declare class process {
    static env: {
        MARKETPLACE_API_URL: string,
        MARKETPLACE_BASE_URL: string,
        [key: string]: ?string
    }
}
