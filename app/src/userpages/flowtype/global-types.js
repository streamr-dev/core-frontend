// @flow

declare class process {
    static env: {
        STREAMR_API_URL: string,
        STREAMR_URL: string,
        USERPAGES_BASE_URL: string,
        USERPAGES_URL_ORIGIN: string,
        STREAMR_WS_URL: string,
        GOOGLE_ANALYTICS_ID: string,
        [key: string]: ?string
    }
}
