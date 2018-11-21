// // @flow
//
// import ProductsPage from './components/ProductsPage'
// import DashboardEditor from './components/DashboardPage/EditorPage'
// import ProfilePage from './components/ProfilePage'
// import ConfirmCsvImportView from './components/StreamPage/ConfirmCsvImport'
// import StreamListView from './components/StreamPage/List'
// import PurchasesPage from './components/PurchasesPage'
// import StreamCreateView from './components/StreamPage/Create'
// import CanvasEdit from '../editor'
// import StreamShowView from './components/StreamPage/Show'
// import TransactionList from './components/TransactionPage/List'
// import DashboardList from './components/DashboardPage/List'
// import CanvasList from './components/CanvasPage/List'
// import { formatPath } from '../shared/utils/url'
// import links from '../links'
//
// const { userpages } = links
//
// export const routes = [
//     {
//         path: userpages.profile,
//         component: ProfilePage,
//         exact: true,
//     },
//     {
//         path: userpages.profileChangePassword,
//         component: ProfileChangePassword,
//         exact: true,
//     },
//     {
//         path: userpages.dashboards,
//         component: DashboardList,
//         exact: true,
//     },
//     {
//         path: userpages.streamCreate,
//         component: StreamCreateView,
//         exact: true,
//     },
//     {
//         path: userpages.streams,
//         component: StreamListView,
//         exact: true,
//     },
//     {
//         path: userpages.canvases,
//         component: CanvasList,
//         exact: true,
//     },
//     {
//         path: userpages.transactions,
//         component: TransactionList,
//         exact: true,
//     },
//     {
//         path: userpages.purchases,
//         component: PurchasesPage,
//         exact: true,
//     },
//     {
//         path: userpages.products,
//         component: ProductsPage,
//         exact: true,
//     },
//     {
//         path: formatPath(userpages.streamShow, ':id?'),
//         component: StreamShowView,
//     },
//     {
//         path: formatPath(userpages.streamShow, ':id?', 'confirmCsvImport'),
//         component: ConfirmCsvImportView,
//     },
//     {
//         path: formatPath(userpages.canvasEditor, ':id?'),
//         component: CanvasEdit,
//     },
//     {
//         path: formatPath(userpages.dashboardEditor, ':id'),
//         component: DashboardEditor,
//     },
// ]
//
// export const redirects = [
//     {
//         from: userpages.main,
//         to: userpages.canvases,
//         exact: true,
//     }
// ]
//
// export default routes
