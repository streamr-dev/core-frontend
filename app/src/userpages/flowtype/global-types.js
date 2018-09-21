// @flow

declare class process {
    static env: {
        STREAMR_API_URL: string,
        STREAMR_URL: string,
        PLATFORM_BASE_PATH: string,
        PLATFORM_ORIGIN_URL: string,
        STREAMR_WS_URL: string,
        GOOGLE_ANALYTICS_ID: string,
        [key: string]: ?string
    }
}
