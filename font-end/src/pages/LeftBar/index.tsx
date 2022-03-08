import React, { Component, ReactNode } from 'react'
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'
import router, { IRouter } from '../../router'
;

const { SubMenu } = Menu;
const { Sider } = Layout

interface IProps {
    collapsed: boolean
}
export default class LeftBar extends Component<IProps>{
    generateMenu = (routerList?: IRouter[]): ReactNode => {
        return (
            <>
                {
                    routerList?.map((reactNode) => {
                        if (reactNode.children) {
                            return (
                                <SubMenu key={reactNode.key} icon={reactNode.icon} title={reactNode.title} >
                                    {
                                        this.generateMenu(reactNode.children)
                                    }
                                </SubMenu>
                            )
                        }
                        return (
                            <Menu.Item key={reactNode.key} icon={reactNode.icon} >
                                <Link to={reactNode.path} >{reactNode.title}</Link>
                            </Menu.Item>
                        )
                    })
                }
            </>
        )
    }


    render() {
        return (
            <>
                <Sider trigger={null} collapsible  collapsed={this.props.collapsed}>
                    <div className='logo'>
                        <h2>若依管理系统</h2>
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
                        {
                            this.generateMenu(router)
                        }
                    </Menu>
                </Sider>
            </>
        )
    }
}
