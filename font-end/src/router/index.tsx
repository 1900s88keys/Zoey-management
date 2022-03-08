import React, { ReactNode, lazy } from 'react'
import {
    UserOutlined,
    SettingOutlined,
    DashboardOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import RoleManger from '../pages/SystemManagement/RoleManage';


//路由的懒加载
const Dashboard = lazy(() => import("../pages/index/index")); //主页 仪表盘
const Login = lazy(() => import("../pages/Login"));// 登录
const Page404 = lazy(() => import("../pages/Page404")); // 404页面
const UserManager = lazy(() => import("../pages/SystemManagement/UserManger")); //用户管理

export interface IRouter {
    title?: string,
    path: string,
    key: string,
    icon?: ReactNode,
    component?: ReactNode,
    children?: IRouter[]
}

const router: IRouter[] = [
    {
        path: '/dashboard',
        title: "首页",
        icon: <DashboardOutlined />,
        key: "dashboard",
        component: <Dashboard />
    },
    {
        path: '/system',
        title: "系统管理",
        icon: <SettingOutlined />,
        key: "system",
        children: [
            {
                path: '/system/user',
                title: "用户管理",
                icon: <UserOutlined />,
                key: "rolemanage",
                component: <UserManager />
            },
            {
                path: '/system/role',
                title: "角色管理",
                icon: <TeamOutlined />,
                key: "usermanage",
                component: <RoleManger />
            },
        ]
    },
]


export const unAuthRouter: IRouter[] = [
    {
        path: '/login',
        title: "登录",
        key: "login",
        component: <Login />
    },

    {
        path: '*',
        title: "404",
        key: "404",
        component: <Page404 />
    }
]

export default router;