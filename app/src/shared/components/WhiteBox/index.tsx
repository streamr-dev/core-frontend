import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import { DESKTOP, TABLET } from '$shared/utils/styled'

const Box = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  @media(${TABLET}) {
    padding: 40px;
  }
  @media(${DESKTOP}) {
    padding: 52px;
  }
`

export const WhiteBox: FunctionComponent<{children: ReactNode | ReactNode[]}> = ({children}) => {
    return <Box>{children}</Box>
}
