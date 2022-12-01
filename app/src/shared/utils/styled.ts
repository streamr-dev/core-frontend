export const SM = 375
export const MD = 744
export const MDLG = 1100
export const LG = 1440
export const XL = 1920
export const REGULAR = 400
export const MEDIUM = 500
export const TOOLBAR_SHADOW = '0 0 10px rgba(0, 0, 0, 0.1)'
export const MONO = "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace"
export const SANS = "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif"
export const PHONE = `(min-width: ${SM}px)`
export const TABLET = `(min-width: ${MD}px)`
export const LAPTOP = `(min-width: ${MDLG}px)`
export const DESKTOP = `(min-width: ${LG}px)`
export enum COLORS {
    primary = '#323232',
    primaryLight = '#525252',
    primaryContrast = '#FFF',
    primaryDisabled = '#A3A3A3',
    secondary = '#F5F5F5',
    secondaryHover = '#E7E7E7',
    secondaryLight = '#F8F8F8',
    focus = '#9BC1FB',
    selection = '#CCE9FD',
    separator = '#EFEFEF',
    disabled = '#ADADAD',
    docLink = '#F1F1F1'
}
