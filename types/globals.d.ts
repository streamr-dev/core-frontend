declare module '*.svg'
declare module '*.png'
declare module '*.json'
declare module '*.toml'

declare module '@dataunions/client' {
    /**
     * Placeholder cause @dataunions/client isn't ethers v6 ready.
     */

    export default DataUnionClient

    export type DataUnion = any
}
