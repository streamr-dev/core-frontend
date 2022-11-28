import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { denormalize } from 'normalizr'
import BN from 'bignumber.js'
import { selectEntities } from '$shared/modules/entities/selectors'
import { categorySchema } from '$shared/modules/entities/schema'
import { Project } from '$mp/types/project-types'
import { COLORS, REGULAR } from '$shared/utils/styled'
import Button from '$shared/components/Button'
import { projectTypeNames } from '$mp/utils/constants'
import PaymentRate from '$mp/components/PaymentRate'
import { formatChainName, getChainIdFromApiString } from '$shared/utils/chains'
import { timeUnits } from '$shared/utils/constants'
import routes from '$routes'

const Description: FunctionComponent<{project: Project}> = ({project}) => {
    const entities = useSelector(selectEntities)
    const category = project && denormalize(project.category, categorySchema, entities)
    return <DescriptionContainer>
        <p>
            <span>The streams in this {projectTypeNames[project.type]} can be accessed for </span>
            <strong>{project.isFree ? 'free' :
                <PaymentRate
                    className={'payment-rate'}
                    amount={new BN(project.pricePerSecond)}
                    chainId={getChainIdFromApiString(project.chain)}
                    pricingTokenAddress={project.pricingTokenAddress}
                    timeUnit={timeUnits.hour}/>}
            </strong>
            <span> on </span>
            <strong>{formatChainName(project.chain)}</strong>
        </p>
        <Button tag={'a'} href={routes.marketplace.product.connect({id: project.id})}>
            Get Access
        </Button>
    </DescriptionContainer>
}

export default Description

const DescriptionContainer = styled.div`
  margin-top: 24px;
  padding: 30px 50px;
  background-color: ${COLORS.primaryContrast};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: ${REGULAR};
  
  .payment-rate {
    display: inline;
  }
  
  p {
    margin: 0;
  }
`
