// @flow

import type { NavigationLink } from '../../../flowtype/navigation-types'
import links from '$shared/../links'

const navigationLinks: NavigationLink = {
    Introduction: links.docs.introduction,
    'Getting Started': links.docs.home,
    Tutorials: links.docs.tutorials,
    'Visual Editor': links.docs.visualEditor,
    'Streamr Engine': links.docs.streamrEngine,
    Marketplace: links.docs.dataMarketplace,
    'Streamr APIs': links.docs.api,
}

export default navigationLinks
