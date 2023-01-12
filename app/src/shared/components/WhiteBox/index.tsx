import React from 'react'
import styled from 'styled-components'
import { DESKTOP, TABLET } from '$shared/utils/styled'

export const WhiteBox = styled.div`
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
