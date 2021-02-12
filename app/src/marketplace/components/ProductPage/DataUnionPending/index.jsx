import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'
import UnstyledDeploySpinner from '$shared/components/DeploySpinner'
import { MD } from '$shared/utils/styled'

const Heading = styled.div`
    letter-spacing: 0;
    font-size: 1rem;
    line-height: 1rem;
`

const DeploySpinner = styled(UnstyledDeploySpinner)``

const DeploySpinnerWrapper = styled.div`
`

const UnstyledDataUnionPending = (props) => (
    <div {...props}>
        <DeploySpinnerWrapper>
            <DeploySpinner isRunning showCounter={false} />
        </DeploySpinnerWrapper>
        <Heading>
            <Translate value="productPage.dataUnionPending.title" />
        </Heading>
    </div>
)

const DataUnionPending = styled(UnstyledDataUnionPending)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ${DeploySpinnerWrapper} {
        max-width: 160px;
    }

    ${DeploySpinnerWrapper} + ${Heading} {
        margin-top: 1rem;
    }

    @media (min-width: ${MD}px) {
        flex-direction: row;

        ${Heading} {
            font-size: 30px;
            line-height: 32px;
        }

        ${DeploySpinnerWrapper} + ${Heading} {
            margin-top: 0;
            margin-left: 4rem;
        }
    }
`

Object.assign(DataUnionPending, {
    Heading,
})

export default DataUnionPending
