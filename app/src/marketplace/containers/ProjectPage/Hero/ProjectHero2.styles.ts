import styled, { css } from 'styled-components'
import { ImageTile } from '$shared/components/Tile'
import { COLORS, LAPTOP, TABLET } from '$shared/utils/styled'

const mobileSpacing = '24px'
const tabletSpacing = '40px'
const desktopSpacing = '50px'

export const ProjectHeroContainer = styled.div<{ overflowVisible?: boolean }>`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: auto auto auto auto;
    background-color: white;
    padding: ${mobileSpacing};
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;

    ${(props) => (props.overflowVisible ? 'overflow: visible;' : '')}

    @media(${TABLET}) {
        padding: ${tabletSpacing};
    }

    @media (${LAPTOP}) {
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr auto;
        padding: 0;
    }
`
export const ProjectHeroImageStyles = css`
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 2;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: ${mobileSpacing};
    @media (${TABLET}) {
        margin-bottom: ${tabletSpacing};
    }
    @media (${LAPTOP}) {
        border-radius: 0;
        margin-bottom: 0;
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 4;
        width: 500px;
        padding: ${tabletSpacing};
    }
`
export const ProjectHeroImage = styled(ImageTile)`
    ${ProjectHeroImageStyles}
    img {
        border-radius: 16px;
    }
`

export const ProjectHeroTitleStyles = css`
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 1;
    font-size: 28px;
    font-weight: 400;
    color: ${COLORS.primary};
    line-height: 44px;
    margin-bottom: ${mobileSpacing};

    @media (${TABLET}) {
        margin-bottom: ${tabletSpacing};
        font-size: 34px;
    }
    @media (${LAPTOP}) {
        grid-column-start: 2;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 1;
        margin: ${desktopSpacing} ${desktopSpacing} ${mobileSpacing} 0;
        height: fit-content;
    }
`
export const ProjectHeroTitle = styled.h1`
    ${ProjectHeroTitleStyles}
`

export const ProjectHeroDescriptionStyles = css`
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 3;
    grid-row-end: 3;
    /*margin-bottom: ${mobileSpacing}; TODO uncomment when enabling Signalling feature */
    @media (${TABLET}) {
        /*margin-bottom: ${tabletSpacing}; TODO uncomment when enabling Signalling feature */
    }
    @media (${LAPTOP}) {
        grid-column-start: 2;
        grid-column-end: 2;
        grid-row-start: 2;
        grid-row-end: 2;
        margin: 0 ${desktopSpacing} 24px 0;
    }
`
export const ProjectHeroMetadataContainer = styled.div`
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 4;
    grid-row-end: 4;
    display: flex;
    gap: 10px;
    margin-top: ${mobileSpacing};

    @media (${LAPTOP}) {
        grid-column-start: 2;
        grid-column-end: 2;
        grid-row-start: 3;
        grid-row-end: 3;
        gap: 6px;
        margin: ${desktopSpacing} ${desktopSpacing} ${desktopSpacing} 0;
    }
`

export const ProjectHeroSignalContainer = styled.div`
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 4;
    grid-row-end: 4;
    background-color: ${COLORS.secondaryLight};
    padding: 20px;
    border-radius: 8px;

    p {
        font-size: 16px;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
        margin: 0;
        strong {
            margin-left: 10px;
        }
        @media (${TABLET}) {
            justify-content: flex-start;
            align-items: center;
        }
    }
    button {
        width: 100%;
        margin-top: 20px;
        @media (${TABLET}) {
            width: inherit;
            margin-top: 0;
        }
    }
    @media (${TABLET}) {
        display: flex;
        justify-content: space-between;
    }
    @media (${LAPTOP}) {
        grid-column-start: 2;
        grid-column-end: 2;
        grid-row-start: 3;
        grid-row-end: 3;
        margin: ${desktopSpacing};
    }
`
