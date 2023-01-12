import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import BN from 'bignumber.js'
import { Project } from '$mp/types/project-types'
import { DESKTOP, REGULAR, TABLET } from '$shared/utils/styled'
import Button from '$shared/components/Button'
import { projectTypeNames } from '$mp/utils/constants'
import PaymentRate from '$mp/components/PaymentRate'
import { formatChainName, getChainIdFromApiString } from '$shared/utils/chains'
import { timeUnits } from '$shared/utils/constants'
import { usePurchaseProject } from '$shared/hooks/usePurchaseProject'
import { WhiteBox } from '$shared/components/WhiteBox'
import routes from '$routes'

const Description: FunctionComponent<{project: Project}> = ({project}) => {
    const onPurchase = usePurchaseProject()
    return <WhiteBox>
        <DescriptionContainer>
            <p>
                <span>The streams in this {projectTypeNames[project.type]}
                    {project.isFree ? ' are public and ' : ''} can be accessed for&nbsp;
                </span>

                <strong>
                    {project.isFree ? 'free' :
                        <PaymentRate
                            amount={new BN(project.pricePerSecond)}
                            chainId={getChainIdFromApiString(project.chain)}
                            pricingTokenAddress={project.pricingTokenAddress}
                            timeUnit={timeUnits.hour}
                            tag={'span'}
                        />
                    }
                </strong>
                {!project.isFree && <>
                    <span> on </span>
                    <strong>{formatChainName(project.chain)}</strong>
                </>
                }
            </p>
            {project.isFree &&
                <Button tag={Link} to={routes.marketplace.product.connect({id: project.id})}>Connect</Button>}
            {!project.isFree && <Button onClick={onPurchase}>Get Access</Button>}
        </DescriptionContainer>
    </WhiteBox>
}

export default Description

const DescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: ${REGULAR};
  flex-direction: column;
  
  p {
    margin: 0;
  }
  
  a {
    width: 100%;
    margin-top: 20px;
    @media(${TABLET}) {
      width: auto;
      margin-top: 0;
      margin-left: 20px;
    }
  }
  
  
  @media(${TABLET}) {
    flex-direction: row;
  }
`
