import 'csstype'

declare module 'csstype' {
    interface Properties {
        [index: `--${string}`]: string
    }
}
