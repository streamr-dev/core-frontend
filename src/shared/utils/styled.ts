const SM = 375
export const MD = 744
const MDLG = 1100
export const LG = 1440
export const XL = 1920
export const LIGHT = 300
export const REGULAR = 400
export const MEDIUM = 500
export const SANS = "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif"
export const PHONE = `(min-width: ${SM}px)`
export const TABLET = `(min-width: ${MD}px)`
export const LAPTOP = `(min-width: ${MDLG}px)`
export const DESKTOP = `(min-width: ${LG}px)`
export const MAX_CONTENT_WIDTH = '678px'
export const MAX_BODY_WIDTH = 1296

export const COLORS = {
    primary: '#323232',
    primaryLight: '#525252',
    primaryContrast: '#FFF',
    primaryDisabled: '#A3A3A3',
    secondary: '#F5F5F5',
    secondaryHover: '#E7E7E7',
    secondaryLight: '#F8F8F8',
    focus: '#9BC1FB',
    click: '#DEEBFF',
    selection: '#CCE9FD',
    disabled: '#ADADAD',
    section: '#F1F1F1',
    inputBackground: '#F1F1F1',
    radioBorder: '#CDCDCD',
    close: '#848484',
    link: '#0324FF',
    linkInactive: '#CDD3FF',
    error: '#D90C25',
    warning: '#FFF6F1',
    dialogBorder: '#F3F3F3',
    black: '#000',
    active: '#0EAC1B',
    greenSpinner: '#29C236',
    spinnerBorder: '#ADADAD7F',
    activeBackground: '#0eac1b1a',
    alertInfoBackground: '#DEEBFF',
    alertErrorBackground: '#FFF4EE',
    alertSuccessBackground: '#E7F7E8',

    // New naming
    Border: '#EFEFEF',
} as const
