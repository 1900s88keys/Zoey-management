import { Form, Input, Button, Checkbox, Col, Row, message } from 'antd'
import React, { Component } from 'react'
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api/index';
import { Navigate } from 'react-router-dom'
import setAuthorizationToken from '../../utils/setAuthorizationToken';
import "./style.less"

interface IPassword{
    user_name: string,
    password: string
}


export default class Login extends Component {
    authenticate = () => {
        //获取页面中存储的token
        let token = sessionStorage.getItem('LOGINTAKEN')
        //根据是否存在token,返回不同的值
        return token ? true : false
    }
    render() {
        const onFinish = async (values: IPassword) => {
            try {
                const { user_name, password } = values;
                // console.log(values);
                const response = await reqLogin(user_name, password)
                const { code, msg, token } = response.data;
                setAuthorizationToken(token);
                console.log(response.data);
                
                if (code === 1000) {//登录成功
                    sessionStorage.setItem("LOGINTAKEN", token); //储存token
                    window.location.href = "/"; //跳转首页
                    message.success(msg);
                } else {
                    message.error(msg);
                    return
                }
            } catch (error) {
                console.log("检验失败");
            }
        };
        
        if(this.authenticate()) {
            return (
                <>
                <Navigate to="/" />
                </>
            )
        }
        return (
                <div id='login'>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <h2>若依后台管理系统</h2>
                        <Form.Item
                            name="user_name"
                            rules={[
                                {
                                    required: true, whitespace: true, message: '用户名不能为空!'
                                },
                                {
                                    min: 4, message: "用户名至少为4位!",
                                },
                                {
                                    max: 12, message: "用户名最多为12位!"
                                },
                                {
                                    pattern: /^[A-z0-9_]+$/, message: "用户名必须是英文、数字或下划线组成!"
                                }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true, whitespace: true, message: '密码不能为空!'
                                },
                                {
                                    min: 6, message: "密码长度不能小于6!",
                                },
                                {
                                    max: 12, message: "密码长度不能大于12!"
                                },
                                {
                                    pattern: /^[A-z0-9_]+$/, message: "密码必须是英文、数字或下划线组成!"
                                }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                maxLength={16}
                                placeholder="请输入密码"
                            />
                        </Form.Item>
                        <Form.Item extra="请输入验证码">
                            <Row gutter={8}>
                                <Col span={14}>
                                    <Form.Item
                                        name="captcha"
                                        noStyle
                                        rules={[{ required: true, message: '请输入您收到的到验证码!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Button>获取图形验证码</Button>
                                </Col>
                            </Row>
                        </Form.Item>


                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住我</Checkbox>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
        )
    }
}
