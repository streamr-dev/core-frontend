import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { NavContainer } from '~/components/Nav'
import { LogoLink, Navbar, NavbarItem } from '~/components/Nav/Nav.styles'
import Logo from '~/shared/components/Logo'
import Button from '~/shared/components/Button'
import { REGULAR } from '~/shared/utils/styled'
import {
    useIsCurrentProjectDraftClean,
    useIsNewProject,
    useIsProjectBusy,
    usePersistCurrentProjectDraft,
} from '~/shared/stores/projectEditor'
import routes from '~/routes'
import { ValidationError } from '~/marketplace/containers/ProjectEditing/ProjectController'
import { errorToast } from '~/utils/toast'
import isCodedError from '~/utils/isCodedError'
import { RejectionReason } from '~/modals/BaseModal'

const FlexNavbar = styled(Navbar)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const FlexNavbarItem = styled(NavbarItem)`
    display: flex;
    align-items: center;

    button {
        margin-left: 10px;
    }

    h1 {
        font-size: 18px;
        font-weight: ${REGULAR};
        margin: 0;
        padding-left: 16px;
    }
`

export default function EditorNav() {
    const busy = useIsProjectBusy()

    const clean = useIsCurrentProjectDraftClean()

    const isNew = useIsNewProject()

    const persist = usePersistCurrentProjectDraft()

    return (
        <NavContainer>
            <FlexNavbar>
                <FlexNavbarItem>
                    <LogoLink href={routes.root()}>
                        <Logo />
                    </LogoLink>
                    <h1>{isNew ? <>Create a project</> : <>Edit a project</>}</h1>
                </FlexNavbarItem>
                <FlexNavbarItem>
                    <Button tag={Link} to={routes.projects.index()} kind="transparent">
                        Exit
                    </Button>
                    <Button disabled={busy || clean} onClick={() => void persist()}>
                        Publish
                    </Button>
                </FlexNavbarItem>
            </FlexNavbar>
        </NavContainer>
    )
}
