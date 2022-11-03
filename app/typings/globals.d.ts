import { CSSProp } from 'styled-components'

declare module '*.pcss'
declare module '*.svg'
declare module '*.png'
declare module '*.json'

declare module 'react' {
    interface Attributes {
        css?: CSSProp
    }
}
