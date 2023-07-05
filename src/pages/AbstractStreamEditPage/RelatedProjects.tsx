import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { MarketplaceProductTile } from '~/marketplace/components/Projects'
import { TABLET, PHONE } from '~/shared/utils/styled'
import { TheGraphProject, getProjects } from '~/services/projects'

const Container = styled.div`
    margin-top: 80px;
    margin-bottom: 120px;
`

const Header = styled.div`
    font-size: 34px;
    line-height: 34px;
    color: #000000;
    padding-bottom: 40px;
`

const ProjectGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 36px;

    @media (${PHONE}) {
        grid-template-columns: 1fr 1fr;
    }

    @media (${TABLET}) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`

type Props = {
    streamId: string
}

export default function RelatedProjects({ streamId }: Props) {
    const [projects, setProjects] = useState<TheGraphProject[]>([])

    useEffect(() => {
        let mounted = true

        const loadProjects = async () => {
            const result = await getProjects(undefined, 4, 0, undefined, streamId)

            if (mounted) {
                setProjects(result.projects)
            }
        }

        loadProjects()

        return () => {
            mounted = false
        }
    }, [streamId])

    if (projects.length === 0) {
        return null
    }

    return (
        <Container>
            <Header>This stream belongs to following projects</Header>
            <ProjectGrid>
                {projects.map((project) => (
                    <MarketplaceProductTile
                        key={project.id}
                        product={project}
                        showDataUnionBadge={false}
                        showEditButton={false}
                    />
                ))}
            </ProjectGrid>
        </Container>
    )
}
