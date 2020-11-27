import React from 'react'
import styled from 'styled-components'

const Name = styled.div`
  color: #323232;
  font-family: var(--sans);
  letter-spacing: 0;
  font-size: 20px;
  line-height: 26px;
`

const UsernameWrapper = styled.div`
  margin-top: 6px;
  line-height: 22px;
`

const Username = styled.div`
  display: inline-block;
  color: #525252;
  font-size: 12px;
  font-family: var(--sans);
  background: #EFEFEF;
  border-radius: 4px;
  padding: 8px 12px;
  line-height: 22px;
`

const UnstyledNameAndUsername = ({ name, username, children, ...props }) => (
    <div {...props}>
        <Name>{name}</Name>
        <UsernameWrapper>
            <Username>
                {children}
            </Username>
        </UsernameWrapper>
    </div>
)

const NameAndUsername = styled(UnstyledNameAndUsername)`
  flex-grow: 1;
`

export default NameAndUsername
