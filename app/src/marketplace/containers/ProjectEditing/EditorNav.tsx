import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import {Link, useHistory} from 'react-router-dom'
import { LogoLink, Navbar, NavbarItem, NavContainer } from '$shared/components/Layout/Nav'
import Logo from '$shared/components/Logo'
import Button from '$shared/components/Button'
import { REGULAR } from '$shared/utils/styled'
import { ProjectControllerContext } from '$mp/containers/ProjectEditing/ProjectController'
import routes from '$routes'

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

export const EditorNav: FunctionComponent<{isNewProject: boolean, editedProductHasChanged?: boolean}> = ({isNewProject, editedProductHasChanged}) => {
    const {create, publishInProgress, update} = useContext(ProjectControllerContext)
    const history = useHistory()
    return <NavContainer>
        <FlexNavbar>
            <FlexNavbarItem>
                <LogoLink href={routes.root()}>
                    <Logo />
                </LogoLink>
                <h1>{isNewProject ? 'Creating' : 'Edit'} a project</h1>
            </FlexNavbarItem>
            <FlexNavbarItem>
                <Button tag={Link} to={routes.marketplace.index()} kind={'transparent'}>Exit</Button>
                <Button
                    disabled={publishInProgress || (!isNewProject && !editedProductHasChanged)}
                    onClick={() => {
                        const save = isNewProject ? create : update
                        save().then((success) => {
                            if (success) {
                                history.push(routes.marketplace.index())
                            }
                        })
                    }}
                >
                    Publish
                </Button>
            </FlexNavbarItem>
        </FlexNavbar>
    </NavContainer>
}
