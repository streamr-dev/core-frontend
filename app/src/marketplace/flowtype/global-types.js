// @flow

declare class process {
    static env: {
        PORT: string,
        NODE_ENV: string,
        GOOGLE_ANALYTICS_ID: string,
        [key: string]: ?string
    }
}
