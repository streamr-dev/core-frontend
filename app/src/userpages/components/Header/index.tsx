import React, {ReactNode} from 'react'
import cx from 'classnames'
import Avatar from '$userpages/components/Avatar'
import ListContainer from '$shared/components/Container/List'
import {useAuthController} from "$auth/hooks/useAuthController"
import routes from '$routes'
import Tab from './Tab'
import AccountsBalance from './AccountsBalance'
import styles from './header.pcss'
type Props = {
    className?: string
    additionalComponent?: ReactNode
    searchComponent?: ReactNode
    filterComponent?: ReactNode
    noHeader?: boolean
}

const Header = ({
    className, additionalComponent, searchComponent, filterComponent, noHeader
}: Props) => {
    const {currentAuthSession} = useAuthController()
    return <ListContainer className={cx(styles.listTemp, className)}>
        {!noHeader && currentAuthSession.address && (
            <div className={styles.profile}>
                <Avatar className={styles.avatar} user={{username: currentAuthSession.address}} linkToProfile>
                    <AccountsBalance/>
                </Avatar>
                <div className={styles.additionalComponent}>{additionalComponent}</div>
            </div>
        )}
        {!noHeader && (
            <div className={styles.tabContainer}>
                <div className={styles.tabBar}>
                    <div className={styles.searchBar}>{searchComponent}</div>
                    <div className={styles.tabs}>
                        <Tab to={routes.streams.index()}>Streams</Tab>
                        <Tab to={routes.products.index()}>Products</Tab>
                        <Tab to={routes.dataunions.index()}>Data Unions</Tab>
                        <Tab to={routes.subscriptions()}>Subscriptions</Tab>
                        <Tab to={routes.transactions()}>Transactions</Tab>
                    </div>
                </div>
                <div className={styles.filterBar}>{filterComponent}</div>
            </div>
        )}
    </ListContainer>
}

Header.defaultProps = {
    noHeader: false,
}
export default Header
