// @flow

declare class process {
    static env: {
        PORT: string,
        NODE_ENV: string,
        GOOGLE_ANALYTICS_ID: string,
        THE_GRAPH_API_URL: string,
        [key: string]: ?string
    }
}
