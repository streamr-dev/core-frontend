import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Alert } from '~/components/Alert'
import { useOperatorForWalletQuery } from '~/hooks/operators'
import { useJoinSponsorshipAsOperator } from '~/hooks/sponsorships'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import Checkbox from '~/shared/components/Checkbox'
import { useCurrentChainId } from '~/utils/chains'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS } from '~/shared/utils/styled'

interface Props {
    onResolve?: () => void
    sponsorship?: ParsedSponsorship
    checkboxState: boolean
    onCheckboxStateChange: (value: boolean) => void
}

export function SponsorshipDisclaimer({
    sponsorship,
    onResolve,
    checkboxState,
    onCheckboxStateChange,
}: Props) {
    const chainId = useCurrentChainId()

    const joinSponsorshipAsOperator = useJoinSponsorshipAsOperator()

    const wallet = useWalletAccount()

    const { data: operator = null } = useOperatorForWalletQuery(wallet)

    return (
        <>
            <StyledAlert type="error" title="Warning">
                To earn, Operators should{' '}
                {sponsorship == null ? (
                    'join Sponsorships'
                ) : (
                    <Link
                        to="#"
                        onClick={() => {
                            if (operator == null) {
                                return
                            }

                            // Close this modal
                            onResolve?.()

                            // Open join sponsorship modal
                            joinSponsorshipAsOperator({
                                chainId,
                                sponsorship,
                                operator,
                            })
                        }}
                    >
                        join Sponsorships
                    </Link>
                )}
                , rather than fund/sponsor them. This action cannot be undone.
            </StyledAlert>
            <Confirm>
                <Checkbox
                    id="fund-sponsorship-checkbox"
                    value={checkboxState}
                    onChange={(e) => {
                        onCheckboxStateChange(e.target.checked)
                    }}
                />
                <label htmlFor="fund-sponsorship-checkbox">
                    I understand this disclaimer and I know what I&apos;m doing.
                </label>
            </Confirm>
        </>
    )
}

const StyledAlert = styled(Alert)`
    margin-top: 16px;

    a {
        color: ${COLORS.link};
    }
`

const Confirm = styled.div`
    display: flex;
    align-items: center;
    margin-top: 8px;

    & label {
        margin-bottom: 0;
    }
`
