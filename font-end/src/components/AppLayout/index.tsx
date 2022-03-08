import React, { Component } from 'react'
import { Layout, Row, Avatar, Col, Dropdown, Menu, Modal, Button } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
    LogoutOutlined,
    FullscreenExitOutlined,
    GithubOutlined,
    SearchOutlined,
    QuestionCircleOutlined,
    FontSizeOutlined
} from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import LeftBar from '../../pages/LeftBar';
import BreadcrumbText from '../BreadcrumbText';
import jwtDecode from 'jwt-decode'
import setAuthorizationToken from '../../utils/setAuthorizationToken';
import "./style.css"

const { Content, Header, } = Layout;
export default class AppLayout extends Component {

    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    handleMenuClick = (e: any) => {
        // console.log('click', e);
        if (e.key === '2') {
            this.confirm()
        }
    }
    // 注销用户
    logout = () => {
        sessionStorage.removeItem('LOGINTAKEN')
        window.location.href = "/login"
    }

    confirm = () => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确认退出吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: this.logout
        });
    }
    render() {
        const taken = sessionStorage.getItem('LOGINTAKEN')
        if (taken) {
            setAuthorizationToken(taken);
        } else {
            return (<>
                <Navigate to="/login" replace />
            </>)
        }
        //获取本地taken 拿到本地admin信息
        const adminInfo = jwtDecode(taken)
        const { avatar } = adminInfo

        const menu = (
            <Menu onClick={this.handleMenuClick} style={{ margin: "20px" }}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    个人信息
                </Menu.Item>
                <Menu.Item key="2" icon={<LogoutOutlined />}>
                    注销
                </Menu.Item>
            </Menu>
        );



        return (
            <>
                <Layout>
                    <LeftBar collapsed={this.state.collapsed} />
                    <Layout >
                        <Header className="site-layout-background" style={{ padding: 0, width: '100%', backgroundColor: 'white' }} >
                            <Row justify="space-between">
                                <Col span={1}>
                                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                        className: 'trigger',
                                        onClick: this.toggle,
                                    })}
                                </Col>
                                <Col span={6}>
                                    <BreadcrumbText />
                                </Col>
                                <Col offset={11} span={6}>
                                    <Button type="link">
                                        <SearchOutlined style={{ fontSize: '25px' }} />
                                    </Button>
                                    <Button type="link">
                                        <GithubOutlined style={{ fontSize: '25px' }} />
                                    </Button>
                                    <Button type="link">
                                        <QuestionCircleOutlined style={{ fontSize: '25px' }} />
                                    </Button>
                                    <Button type="link">
                                        <FullscreenExitOutlined style={{ fontSize: '25px' }} />
                                    </Button>
                                    <Button type="link"
                                        style={{ marginRight: "30px", }}
                                    >
                                        <FontSizeOutlined style={{ fontSize: '25px' }} />
                                    </Button>
                                    <Dropdown overlay={menu}

                                        overlayStyle={{ margin: "20px" }}
                                        placement={"bottomCenter"}>
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <Avatar
                                                shape="square"
                                                size={49}
                                                src={avatar}
                                                style={{

                                                    borderRadius: "10px",
                                                    position: "relative",
                                                    right: "0px"
                                                }}
                                            />
                                            <DownOutlined />
                                        </a>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </Header>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>

            </>
        );
    }
}