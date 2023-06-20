import React from 'react'
import styled from 'styled-components'
import SearchBar from '$shared/components/SearchBar'
import { COLORS, DESKTOP, TABLET } from '$shared/utils/styled'

const NetworkSearchBarWrap = styled.div`
    background-color: ${COLORS.primaryContrast};
    display: flex;
    align-items: center;
    justify-content: center;

    .inner {
        padding: 30px 24px;
        max-width: 770px;
        margin: 0 auto;
        width: 100%;
        @media (${TABLET}) {
            padding: 40px 72px 80px;
        }
        /*> * {
            max-width: 770px;
            margin: 0 24px;
            @media (${TABLET}) {
                margin: 0 72px;
            }
            @media (${DESKTOP}) {
                margin: 0;
            }
        }*/
    }
`
export const NetworkSearchBar = () => {
    return (
        <NetworkSearchBarWrap>
            <div className="inner">
                <SearchBar />
            </div>
        </NetworkSearchBarWrap>
    )
}
